import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import { formatDistance } from "date-fns";
import deepEqual from "deep-equal";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { MOCK_API_RESPONSE, AppFile, AppData } from "./mockApiResponse";

const POLLING_INTERVAL_IN_MS = 5000;
const TIMER_UPDATE_INTERVAL_IN_MS = 10000;
const CACHE_KEY = "appData";

type State = "idle" | "dragging" | "over";

function CenteredContainer({ children }: React.PropsWithChildren<{}>) {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Container>
  );
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: [CACHE_KEY],
    queryFn: () => {
      const appData = localStorage.getItem(CACHE_KEY);
      if (!appData) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(MOCK_API_RESPONSE));
        return MOCK_API_RESPONSE;
      }
      return JSON.parse(appData);
    },
  });

  const files = useMemo(() => {
    return data?.files || [];
  }, [data]);

  if (!data || !data.files) {
    return (
      <CenteredContainer>
        <Typography variant="overline" display="block" gutterBottom>
          something went wrong
        </Typography>
      </CenteredContainer>
    );
  }

  if (isLoading) {
    return (
      <CenteredContainer>
        <CircularProgress />
      </CenteredContainer>
    );
  }

  return (
    <DraggableCats key={"files"} files={files} timestamp={data.timestamp} />
  );
}

function DraggableCats({ files, timestamp }: AppData) {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());
  const [gridItems, setGridItems] = useState(files);
  const [lastSaved, setLastSaved] = useState(timestamp);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, TIMER_UPDATE_INTERVAL_IN_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          return;
        }
        const destinationSrc = destination.data.item as AppFile;
        const startSrc = source.data.item as AppFile;

        const updated = [...gridItems];
        updated[gridItems.indexOf(startSrc)] = destinationSrc;
        updated[gridItems.indexOf(destinationSrc)] = startSrc;

        setGridItems(updated);
      },
    });
  }, [gridItems]);

  useEffect(() => {
    async function cb() {
      if (deepEqual(gridItems, files)) {
        return;
      }

      setIsUpdating(true);
      await new Promise((resolve) => {
        setTimeout(resolve, 400 + Math.floor(Math.random() * 200));
      });
      const appData = {
        files: gridItems,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(appData));
      setLastSaved(appData.timestamp);
      setIsUpdating(false);
      queryClient.invalidateQueries();
    }

    const intervalId = setInterval(cb, POLLING_INTERVAL_IN_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [gridItems, files]);

  return (
    <CenteredContainer>
      <Container
        sx={{
          flexDirection: "column",
          display: "flex",
          width: "40rem",
          padding: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        }}
      >
        <Container
          sx={{
            background: "white",
            padding: "0.25rem 0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "1rem",
            borderBottom: "1px solid black",
            marginBottom: "1rem",
          }}
        >
          {isUpdating && <CircularProgress size={"1.5rem"} color="info" />}
          <Typography variant="subtitle1" display="block" gutterBottom>
            last synced :{" "}
            {`${formatDistance(currentTime, lastSaved, {
              includeSeconds: true,
            })} ago`}
          </Typography>
        </Container>
        <Grid columns={3} container m={0} p={0} alignItems={"center"}>
          {gridItems.map((item) => (
            <Item item={item} key={item.imageUrl} />
          ))}
        </Grid>
      </Container>
    </CenteredContainer>
  );
}

function Item({ item }: { item: AppFile }) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [state, setState] = useState<State>("idle");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onImageClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const el = ref.current;
    return combine(
      draggable({
        element: el as HTMLImageElement,
        getInitialData: () => ({ type: "grid-item", item }),
        onDragStart: () => setState("dragging"),
        onDrop: () => setState("idle"),
      }),
      dropTargetForElements({
        element: el as HTMLImageElement,
        getData: () => ({ item }),
        getIsSticky: () => true,
        canDrop: ({ source }) =>
          source.data.type === "grid-item" && source.data.item !== item,
        onDragEnter: () => setState("over"),
        onDragLeave: () => setState("idle"),
        onDrop: () => setState("idle"),
      })
    );
  }, [item]);

  return (
    <Grid
      item
      xs={1}
      sx={{
        border: state === "over" ? "1px solid black" : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "13rem",
        boxSizing: "border-box",
        padding: "0.5rem",
      }}
    >
      {isLoading && <CircularProgress />}
      <img
        onClick={onImageClick}
        style={{
          height: "100%",
          width: "100%",
          display: isLoading ? "none" : "block",
          objectFit: "cover",
          objectPosition: "top",
        }}
        src={item.imageUrl}
        ref={ref}
        onLoad={() => setIsLoading(false)}
      />
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "20rem",
            height: "20rem",
            bgcolor: "background.paper",
            border: "none",
            outline: "none",
            boxShadow: 16,
            p: 4,
          }}
        >
          <img
            src={item.imageUrl}
            style={{ width: "100%", height: "100%", objectFit: "fill" }}
          />
        </Box>
      </Modal>
    </Grid>
  );
}
