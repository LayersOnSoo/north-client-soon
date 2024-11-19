import { createFileObject } from "@/utils";

interface FileData {
  fileData: string;
  fileName: string;
  mimeType: string;
}

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT as string;

export async function storeFile(
  { fileData, fileName, mimeType }: FileData,
  name: string
): Promise<{
  result: { IpfsHash: string; PinSize: number; Timestamp: string } | null;
  errors: string | null;
}> {
  try {
    const file = createFileObject(fileData, fileName, mimeType);
    const data = new FormData();
    data.append("file", file);
    const pinataMetadata = JSON.stringify({
      name,
    });
    data.append("pinataMetadata", pinataMetadata);

    const upload = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: data,
      }
    );
    const uploadRes = await upload.json();
    return { result: uploadRes, errors: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return { result: null, errors: error.message };
  }
}
