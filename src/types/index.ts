export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type NodeType = 'http' | 'transform' | 'condition' | 'assert' | 'delay';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'skipped';

export interface HeaderPair {
  key: string;
  value: string;
  enabled: boolean;
}

export interface VariableExtractor {
  id: string;
  variableName: string; // e.g., 'jwt_token'
  path: string; // e.g., 'body.token' or 'body.data.user.id'
}

export interface AssertionRule {
  id: string;
  target: 'status' | 'latency' | 'body_contains';
  operator: 'equals' | 'less_than' | 'greater_than' | 'contains';
  expected: string;
  passed?: boolean;
}

export interface NodeResponse {
  status: number;
  statusText: string;
  latencyMs: number;
  sizeBytes: number;
  body: string;
  parsedBody?: any;
  headers: Record<string, string>;
  timestamp: number;
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: NodeType;
  position: { x: number; y: number };
  method: HttpMethod;
  url: string;
  headers: HeaderPair[];
  queryParams: HeaderPair[];
  body: string;
  authType: 'none' | 'bearer' | 'apikey';
  authToken?: string;
  extractors: VariableExtractor[];
  assertions: AssertionRule[];
  status: NodeStatus;
  lastResponse?: NodeResponse;
  delayMs?: number;
  conditionScript?: string;
}

export interface EdgeConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  animated?: boolean;
}

export interface EnvironmentVar {
  key: string;
  value: string;
  enabled: boolean;
  secret?: boolean;
}

export interface LoadTestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatency: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
  minLatency: number;
  maxLatency: number;
  currentRps: number;
  statusCodes: Record<number, number>;
  timeSeries: {
    second: number;
    rps: number;
    p95Latency: number;
    avgLatency: number;
    activeVus: number;
    errors: number;
  }[];
}
