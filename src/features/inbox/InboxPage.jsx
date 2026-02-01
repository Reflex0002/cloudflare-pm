import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FeedbackDetailPanel } from "./FeedbackDetailPanel";
import { FeedbackTablePanel } from "./FeedbackTablePanel";
import { InboxSidebar } from "./InboxSidebar";
import "./inbox.css";

export const InboxPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("selected");

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [selectedId]);

  const handleSelect = (id) => {
    const nextParams = new URLSearchParams(searchParams);
    if (id) {
      nextParams.set("selected", id);
    } else {
      nextParams.delete("selected");
    }
    setSearchParams(nextParams);
  };

  return (
    <>
      {selectedId && <div className="detail-overlay" onClick={() => handleSelect(null)} />}
      <div className="inbox-layout">
        <InboxSidebar />
        <FeedbackTablePanel selectedId={selectedId} onSelect={handleSelect} />
        <FeedbackDetailPanel selectedId={selectedId} />
      </div>
    </>
  );
};
