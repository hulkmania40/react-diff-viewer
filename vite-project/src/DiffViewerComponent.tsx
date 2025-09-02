import React from "react";
import ReactDiffViewer from "react-diff-viewer";

interface DiffViewerComponentProps {
  oldFile: string;
  newFile: string;
}

const DiffViewerComponent: React.FC<DiffViewerComponentProps> = ({ oldFile, newFile }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">File Differences</h2>
      <ReactDiffViewer
        oldValue={oldFile}
        newValue={newFile}
        splitView={true} // side-by-side view
        hideLineNumbers={false}
        showDiffOnly={false}
      />
    </div>
  );
};

export default DiffViewerComponent;
