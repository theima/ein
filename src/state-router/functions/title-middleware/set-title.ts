export function setTitle(doc: { title: string }): (title: string) => void {
  return (title: string) => {
    doc.title = title;
  };
}
