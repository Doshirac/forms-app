import React from "react";
import { useParams } from "react-router";
import Editor from "../../components/Editor/Editor";

const Edit = () => {
  const { id } = useParams();

  return (
    <div className="sjs-editor-container">
      <Editor id={id} />
    </div>
  );
};

export default Edit;
