declare module 'mammoth/mammoth.browser' {
  const mammoth: {
    convertToHtml: (input: { arrayBuffer: ArrayBuffer }, options?: unknown) => Promise<{ value: string }>
  };
  export default mammoth;
}