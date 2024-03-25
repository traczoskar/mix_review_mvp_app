import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const uploadFileSlice = createSlice({
  name: "uploadFile",
  initialState: {
    fileUploaded: null as string | null,
    isFileUploaded: false,
  },
  reducers: {
    setFileUploaded: (state, action: PayloadAction<string | null>) => {
      state.fileUploaded = action.payload;
      state.isFileUploaded = true;
    },
  },
});

export const { setFileUploaded } = uploadFileSlice.actions;

export const selectUploadFileState = (state: any) => state.uploadFile;
export const selectFileUploaded = (state: any) =>
  selectUploadFileState(state).fileUploaded;
export const selectIsFileUploaded = (state: any) =>
  selectUploadFileState(state).isFileUploaded;

export default uploadFileSlice.reducer;
