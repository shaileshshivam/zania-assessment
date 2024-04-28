interface AppFile {
  type: string;
  title: string;
  position: number;
  imageUrl: string;
  category: string;
}

interface AppData {
  files: AppFile[];
  timestamp: string;
}

const MOCK_API_RESPONSE: AppData = {
  files: [
    {
      type: "bank-draft",
      title: "Bank Draft",
      position: 0,
      imageUrl:
        "https://media2.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif?cid=570ad1c2src7yp645n2cgjrpg6w4th0h8pent66ipnbgj5am&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      category: "Finance",
    },
    {
      type: "bill-of-lading",
      title: "Bill of Lading",
      position: 1,
      imageUrl:
        "https://media0.giphy.com/media/2x0VePimPaFJDpGZ7H/giphy.gif?cid=570ad1c2src7yp645n2cgjrpg6w4th0h8pent66ipnbgj5am&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      category: "Shipping",
    },
    {
      type: "invoice",
      title: "Invoice",
      position: 2,
      imageUrl:
        "https://media1.giphy.com/media/1ViLp0GBYhTcA/giphy.gif?cid=570ad1c2src7yp645n2cgjrpg6w4th0h8pent66ipnbgj5am&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      category: "Finance",
    },
    {
      type: "bank-draft-2",
      title: "Bank Draft 2",
      position: 3,
      imageUrl:
        "https://media0.giphy.com/media/6VoDJzfRjJNbG/giphy.gif?cid=570ad1c2src7yp645n2cgjrpg6w4th0h8pent66ipnbgj5am&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      category: "Finance",
    },
    {
      type: "bill-of-lading-2",
      title: "Bill of Lading 2",
      position: 4,
      imageUrl:
        "https://media1.giphy.com/media/Rh5H3qMsVSsMrThuN1/giphy.gif?cid=570ad1c2pxmxygvhx1smr8htahhmvutzu7uzy0jh11vb82yu&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      category: "Shipping",
    },
  ],
  timestamp: new Date().toISOString(),
};

export { MOCK_API_RESPONSE }
export type { AppData, AppFile }