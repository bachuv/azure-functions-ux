import { LinePositionSpanTextChange } from "./line-position";

export interface UpdateBufferRequest {
    FileName: string;
    Line?: number;
    Column?: number;
    Buffer?: string;
    Changes?: LinePositionSpanTextChange[]; 
    FromDisk?: boolean;
}