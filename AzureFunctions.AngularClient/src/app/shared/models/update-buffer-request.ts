import { LinePositionSpanTextChange } from "./line-position";

export class UpdateBufferRequest {
    fileName: string;
    line?: number;
    column?: number;
    buffer?: string;
    changes?: LinePositionSpanTextChange[]; 
    fromDisk?: boolean;
}