import { GlobalResponseObject } from '../common';
import { ISevaOpportunity } from './seva-opportunity.interface';

export class GetAllSevasResponse extends GlobalResponseObject<ISevaOpportunity[]> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Sevas retrieved successfully', data?: ISevaOpportunity[]) {
    super(status, errorCode, internalMessage, data);
  }
}
