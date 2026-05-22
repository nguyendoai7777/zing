export interface ViewMoreProps {
  width: string;
  text: string;
}
export const ViewMore = (pr: ViewMoreProps) => {
  return (
    <>
      <div style={{ width: pr.width }} className="view-more flex-center-center">
        {pr.text}
      </div>
    </>
  );
};
