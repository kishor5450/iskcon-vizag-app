import { GlobalResponseObject } from '../common';
import { ISevaOpportunity } from './seva-opportunity.interface';

export class CreateSevaResponse extends GlobalResponseObject<ISevaOpportunity> {
  constructor(status: boolean = true, errorCode: number = 0, internalMessage: string = 'Seva opportunity created successfully', data?: ISevaOpportunity) {
    super(status, errorCode, internalMessage, data);
  }
}
