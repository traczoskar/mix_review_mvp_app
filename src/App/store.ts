import { configureStore } from "@reduxjs/toolkit";
import uploadFileReducer from "../features/UploadFile/uploadFileSlice";

const store = configureStore({
  reducer: {
    uploadFile: uploadFileReducer,
  },
});

export default store;
