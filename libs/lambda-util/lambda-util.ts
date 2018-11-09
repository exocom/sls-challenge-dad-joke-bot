import {APIGatewayEvent, APIGatewayProxyResult, Context, ScheduledEvent} from 'aws-lambda';


type headers = {
  [header: string]: boolean | number | string;
};

export type lambdaUtilOptions = {
  headers?: headers;
};

export class LambdaUtil {
  private _headers: headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  };

  constructor({headers}: lambdaUtilOptions = {}) {
    if (headers) this._headers = headers;
  }

  apiResponseJson<T>({statusCode = 200, body = null, headers = this._headers}: ApiJsonResponse<T>): APIGatewayProxyResult {
    return {
      statusCode,
      body: body ? JSON.stringify(body) : "",
      headers
    };
  }

  apiResponseBinary<T>({statusCode = 200, body = null, headers = this._headers}: ApiBinaryResponse<T>): APIGatewayProxyResult {
    return {
      isBase64Encoded: true,
      statusCode,
      body: body.toString('base64'),
      headers
    };
  }
}

export const buildIAMPolicy = (userId, effect, resource, context) => {
  const policy = {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  return policy;
};


export type ScheduleEventHandler = (
  event: ScheduledEvent,
  context: Context
) => void;

export type ApiGatewayHandler = (
  event: APIGatewayEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

interface ApiJsonResponse<T> {
  statusCode?: number;
  body?: ApiBody<T> | ApiErrorsBody<T>;
  headers?: headers;
}

interface ApiBinaryResponse<T> {
  statusCode?: number;
  body?: Buffer | null;
  headers?: headers;
}

export interface ApiBody<T> {
  data: T;
  meta?: Meta;
}

export interface ApiErrorsBody<T> {
  errors: Array<T>;
  meta?: Meta;
}

export interface Meta {
}

export interface ContactFlowCustomerEndpoint {
  Address: string;
  Type: string;

}
export interface ContactFlowSystemEndpoint {
  Address: string;
  Type: string;
}

export interface ContactFlowContactData {
  Attributes: any;
  Channel: string;
  ContactId: string;
  CustomerEndpoint: ContactFlowCustomerEndpoint;
  InitialContactId: string;
  InitiationMethod: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'CALLBACK';
  InstanceARN: string;
  PreviousContactId: string;
  Queue: string;
  SystemEndpoint:ContactFlowSystemEndpoint;
}

export interface ContactFlowDetails {
  ContactData: ContactFlowContactData;
  Parameters: any;
}

export interface  ContactFlowEvent {
  Details: ContactFlowDetails;
  Name: string;
}

export type AmazonConnectHandler = (
  event: ContactFlowEvent,
  context: Context
) => Promise<any>;