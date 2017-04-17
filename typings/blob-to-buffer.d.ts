declare module "blob-to-buffer" {
    export default function(blob: Blob, callback: (err: Error, buffer: Buffer) => void);
}
