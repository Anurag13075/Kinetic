import { create } from 'zustand';
import { WorkflowNode, EdgeConnection, EnvironmentVar, NodeResponse } from '@/types';

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: EdgeConnection[];
  selectedNodeId: string | null;
  activeTab: 'canvas' | 'load-test' | 'ai-fuzzer' | 'telemetry';
  runtimeVariables: Record<string, any>;
  environment: string;
  environments: Record<string, EnvironmentVar[]>;
  isExecuting: boolean;
  activeExecutionNodeId: string | null;
  canvasViewport: { x: number; y: number; zoom: number };

  // Actions
  setActiveTab: (tab: 'canvas' | 'load-test' | 'ai-fuzzer' | 'telemetry') => void;
  selectNode: (id: string | null) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeData: (id: string, updates: Partial<WorkflowNode>) => void;
  addNode: (type?: WorkflowNode['type'], position?: { x: number; y: number }) => string;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  addEdge: (fromNodeId: string, toNodeId: string) => void;
  deleteEdge: (id: string) => void;
  setCanvasViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  updateEnvironmentVar: (envName: string, key: string, value: string) => void;
  setEnvironment: (env: string) => void;

  // Real Network Execution Engine
  runSingleNode: (nodeId: string) => Promise<NodeResponse>;
  runEntirePipeline: () => Promise<void>;
  resetPipelineStatus: () => void;
  importCurl: (curlString: string) => void;
}

// Deep object resolver for paths like "body.token" or "headers.content-type"
function resolvePath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const cleanPath = path.startsWith('body.') ? path.slice(5) : path;
  const parts = cleanPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

const INITIAL_NODES: WorkflowNode[] = [
  {
    id: 'node-auth',
    name: '1. User Auth (Real JWT)',
    type: 'http',
    position: { x: 60, y: 140 },
    method: 'POST',
    url: 'https://dummyjson.com/auth/login',
    headers: [
      { key: 'Content-Type', value: 'application/json', enabled: true },
    ],
    queryParams: [],
    body: JSON.stringify(
      {
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 30,
      },
      null,
      2
    ),
    authType: 'none',
    extractors: [
      { id: 'ext-1', variableName: 'auth_token', path: 'body.token' },
      { id: 'ext-2', variableName: 'user_id', path: 'body.id' },
      { id: 'ext-3', variableName: 'user_email', path: 'body.email' },
    ],
    assertions: [
      { id: 'ass-1', target: 'status', operator: 'equals', expected: '200' },
      { id: 'ass-2', target: 'body_contains', operator: 'contains', expected: 'token' },
    ],
    status: 'idle',
  },
  {
    id: 'node-profile',
    name: '2. Authenticated Profile',
    type: 'http',
    position: { x: 440, y: 140 },
    method: 'GET',
    url: 'https://dummyjson.com/auth/me',
    headers: [
      { key: 'Authorization', value: 'Bearer {{auth_token}}', enabled: true },
      { key: 'Accept', value: 'application/json', enabled: true },
    ],
    queryParams: [],
    body: '',
    authType: 'bearer',
    authToken: '{{auth_token}}',
    extractors: [
      { id: 'ext-4', variableName: 'first_name', path: 'body.firstName' },
      { id: 'ext-5', variableName: 'user_role', path: 'body.role' },
    ],
    assertions: [
      { id: 'ass-3', target: 'status', operator: 'equals', expected: '200' },
    ],
    status: 'idle',
  },
  {
    id: 'node-cart',
    name: '3. Fetch User Cart',
    type: 'http',
    position: { x: 820, y: 140 },
    method: 'GET',
    url: 'https://dummyjson.com/carts/user/1',
    headers: [
      { key: 'Authorization', value: 'Bearer {{auth_token}}', enabled: true },
    ],
    queryParams: [],
    body: '',
    authType: 'none',
    extractors: [
      { id: 'ext-6', variableName: 'cart_total', path: 'body.carts.0.total' },
    ],
    assertions: [
      { id: 'ass-4', target: 'status', operator: 'equals', expected: '200' },
    ],
    status: 'idle',
  },
];

const INITIAL_EDGES: EdgeConnection[] = [
  { id: 'edge-1', fromNodeId: 'node-auth', toNodeId: 'node-profile' },
  { id: 'edge-2', fromNodeId: 'node-profile', toNodeId: 'node-cart' },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNodeId: 'node-auth',
  activeTab: 'canvas',
  runtimeVariables: {
    auth_token: '',
    user_id: '1',
    user_email: 'emily.johnson@x.dummyjson.com',
  },
  environment: 'Production Gateway',
  environments: {
    'Production Gateway': [
      { key: 'BASE_URL', value: 'https://dummyjson.com', enabled: true },
      { key: 'TIMEOUT_MS', value: '5000', enabled: true },
    ],
    'Staging Cloud': [
      { key: 'BASE_URL', value: 'https://httpbin.org', enabled: true },
      { key: 'TIMEOUT_MS', value: '8000', enabled: true },
    ],
  },
  isExecuting: false,
  activeExecutionNodeId: null,
  canvasViewport: { x: 0, y: 0, zoom: 1 },

  setActiveTab: (tab) => set({ activeTab: tab }),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodePosition: (id, x, y) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position: { x, y } } : node
      ),
    }));
  },

  updateNodeData: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    }));
  },

  addNode: (type = 'http', position) => {
    const newId = `node-${Date.now().toString(36)}`;
    const count = get().nodes.length + 1;
    const defaultPos = position || {
      x: 100 + (count % 3) * 340,
      y: 120 + Math.floor(count / 3) * 160,
    };

    const newNode: WorkflowNode = {
      id: newId,
      name: `${count}. Request Endpoint`,
      type,
      position: defaultPos,
      method: 'GET',
      url: 'https://dummyjson.com/products/1',
      headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
      queryParams: [],
      body: '',
      authType: 'none',
      extractors: [],
      assertions: [
        { id: `ass-${Date.now()}`, target: 'status', operator: 'equals', expected: '200' },
      ],
      status: 'idle',
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: newId,
    }));

    return newId;
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.fromNodeId !== id && edge.toNodeId !== id
      ),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  duplicateNode: (id) => {
    const target = get().nodes.find((n) => n.id === id);
    if (!target) return;
    const newId = `node-${Date.now().toString(36)}`;
    const cloned: WorkflowNode = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      position: { x: target.position.x + 40, y: target.position.y + 40 },
      status: 'idle',
      lastResponse: undefined,
    };
    set((state) => ({
      nodes: [...state.nodes, cloned],
      selectedNodeId: newId,
    }));
  },

  addEdge: (fromNodeId, toNodeId) => {
    if (fromNodeId === toNodeId) return;
    const exists = get().edges.some(
      (e) => e.fromNodeId === fromNodeId && e.toNodeId === toNodeId
    );
    if (exists) return;

    const newEdge: EdgeConnection = {
      id: `edge-${Date.now().toString(36)}`,
      fromNodeId,
      toNodeId,
    };
    set((state) => ({ edges: [...state.edges, newEdge] }));
  },

  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    }));
  },

  setCanvasViewport: (canvasViewport) => set({ canvasViewport }),

  updateEnvironmentVar: (envName, key, value) => {
    set((state) => {
      const currentList = state.environments[envName] || [];
      const updated = currentList.map((item) =>
        item.key === key ? { ...item, value } : item
      );
      return {
        environments: { ...state.environments, [envName]: updated },
      };
    });
  },

  setEnvironment: (environment) => set({ environment }),

  resetPipelineStatus: () => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({
        ...n,
        status: 'idle',
        assertions: n.assertions.map((a) => ({ ...a, passed: undefined })),
      })),
    }));
  },

  // Real Network Execution Engine (Zero Fake Data)
  runSingleNode: async (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) throw new Error('Node not found');

    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, status: 'running' } : n)),
      activeExecutionNodeId: nodeId,
    }));

    const variables = get().runtimeVariables;
    const interpolate = (str: string) => {
      if (!str) return '';
      return str.replace(/\{\{([\w_]+)\}\}/g, (_, key) => {
        return variables[key] !== undefined ? String(variables[key]) : `{{${key}}}`;
      });
    };

    const finalUrl = interpolate(node.url);
    const finalHeaders: Record<string, string> = {};
    node.headers.forEach((h) => {
      if (h.enabled && h.key) {
        finalHeaders[h.key] = interpolate(h.value);
      }
    });

    if (node.authType === 'bearer' && node.authToken) {
      finalHeaders['Authorization'] = `Bearer ${interpolate(node.authToken)}`;
    }

    const finalBody = node.body ? interpolate(node.body) : undefined;
    const startTime = performance.now();

    try {
      let responseData: NodeResponse;

      // Call our Next.js real proxy endpoint to bypass CORS and get real live telemetry
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: finalUrl,
          method: node.method,
          headers: finalHeaders,
          body: finalBody,
        }),
      });

      if (!res.ok && res.status !== 502) {
        throw new Error(`Proxy error: ${res.statusText}`);
      }

      const proxyResult = await res.json();
      responseData = {
        status: proxyResult.status,
        statusText: proxyResult.statusText,
        latencyMs: proxyResult.latencyMs || Math.round(performance.now() - startTime),
        sizeBytes: proxyResult.sizeBytes || 0,
        body: proxyResult.body || JSON.stringify(proxyResult),
        parsedBody: proxyResult.parsedBody,
        headers: proxyResult.headers || {},
        timestamp: proxyResult.timestamp || Date.now(),
      };

      // Check Real Assertions
      const updatedAssertions = node.assertions.map((a) => {
        if (a.target === 'status') {
          return { ...a, passed: String(responseData.status) === a.expected };
        }
        if (a.target === 'latency') {
          return { ...a, passed: responseData.latencyMs <= Number(a.expected) };
        }
        if (a.target === 'body_contains') {
          return { ...a, passed: responseData.body.includes(a.expected) };
        }
        return { ...a, passed: true };
      });

      const allAssertionsPassed = updatedAssertions.every((a) => a.passed !== false);

      // Extract real variables dynamically from live JSON body
      const newExtractedVars: Record<string, any> = {};
      if (responseData.parsedBody) {
        node.extractors.forEach((ext) => {
          const val = resolvePath(responseData.parsedBody, ext.path);
          if (val !== undefined) {
            newExtractedVars[ext.variableName] = val;
          }
        });
      }

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: allAssertionsPassed && responseData.status < 400 ? 'success' : 'error',
                lastResponse: responseData,
                assertions: updatedAssertions,
              }
            : n
        ),
        runtimeVariables: { ...state.runtimeVariables, ...newExtractedVars },
        activeExecutionNodeId: null,
      }));

      return responseData;
    } catch (err: any) {
      const errResponse: NodeResponse = {
        status: 500,
        statusText: 'Network Failure',
        latencyMs: Math.round(performance.now() - startTime),
        sizeBytes: 0,
        body: JSON.stringify({ error: err.message || 'Failed to fetch external API' }, null, 2),
        headers: {},
        timestamp: Date.now(),
      };

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId ? { ...n, status: 'error', lastResponse: errResponse } : n
        ),
        activeExecutionNodeId: null,
      }));

      throw err;
    }
  },

  runEntirePipeline: async () => {
    set({ isExecuting: true });
    get().resetPipelineStatus();

    const nodes = get().nodes;
    for (const node of nodes) {
      try {
        await get().runSingleNode(node.id);
        await new Promise((res) => setTimeout(res, 200));
      } catch (err) {
        break; // stop sequence on network break
      }
    }

    set({ isExecuting: false, activeExecutionNodeId: null });
  },

  importCurl: (curlString: string) => {
    let method: WorkflowNode['method'] = 'GET';
    let url = 'https://dummyjson.com/products/1';
    const headers: { key: string; value: string; enabled: boolean }[] = [];
    let body = '';

    const methodMatch = curlString.match(/-X\s+([A-Z]+)/i);
    if (methodMatch) method = methodMatch[1].toUpperCase() as any;

    const urlMatch = curlString.match(/curl\s+["']?([^"'\s]+)["']?/);
    if (urlMatch) url = urlMatch[1];

    const headerRegex = /-H\s+["']([^"']+)["']/g;
    let hMatch;
    while ((hMatch = headerRegex.exec(curlString)) !== null) {
      const parts = hMatch[1].split(':');
      if (parts.length >= 2) {
        headers.push({
          key: parts[0].trim(),
          value: parts.slice(1).join(':').trim(),
          enabled: true,
        });
      }
    }

    const dataMatch = curlString.match(/--data(-raw)?\s+["']([^"']+)["']/);
    if (dataMatch) {
      body = dataMatch[2];
      if (method === 'GET') method = 'POST';
    }

    const newId = `node-${Date.now().toString(36)}`;
    const newNode: WorkflowNode = {
      id: newId,
      name: 'Imported cURL Endpoint',
      type: 'http',
      position: { x: 300, y: 320 },
      method,
      url,
      headers: headers.length > 0 ? headers : [{ key: 'Accept', value: 'application/json', enabled: true }],
      queryParams: [],
      body,
      authType: 'none',
      extractors: [],
      assertions: [{ id: 'ass-imp', target: 'status', operator: 'equals', expected: '200' }],
      status: 'idle',
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: newId,
    }));
  },
}));
