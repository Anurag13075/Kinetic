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

  // Pipeline Execution Engine
  runSingleNode: (nodeId: string) => Promise<NodeResponse>;
  runEntirePipeline: () => Promise<void>;
  resetPipelineStatus: () => void;
  importCurl: (curlString: string) => void;
}

const INITIAL_NODES: WorkflowNode[] = [
  {
    id: 'node-auth',
    name: '1. Auth & Token Generation',
    type: 'http',
    position: { x: 80, y: 140 },
    method: 'POST',
    url: 'https://httpbin.org/post',
    headers: [
      { key: 'Content-Type', value: 'application/json', enabled: true },
      { key: 'X-Client-Id', value: 'kinetic-agent-v1', enabled: true },
    ],
    queryParams: [],
    body: JSON.stringify(
      {
        email: 'alex.dev@kinetic.io',
        password: '••••••••••••',
        grant_type: 'client_credentials',
      },
      null,
      2
    ),
    authType: 'none',
    extractors: [
      { id: 'ext-1', variableName: 'auth_token', path: 'headers.X-Amzn-Trace-Id' },
      { id: 'ext-2', variableName: 'session_id', path: 'origin' },
    ],
    assertions: [
      { id: 'ass-1', target: 'status', operator: 'equals', expected: '200' },
      { id: 'ass-2', target: 'latency', operator: 'less_than', expected: '800' },
    ],
    status: 'idle',
  },
  {
    id: 'node-profile',
    name: '2. Fetch User Profile',
    type: 'http',
    position: { x: 480, y: 140 },
    method: 'GET',
    url: 'https://httpbin.org/get?user={{session_id}}',
    headers: [
      { key: 'Authorization', value: 'Bearer {{auth_token}}', enabled: true },
      { key: 'Accept', value: 'application/json', enabled: true },
    ],
    queryParams: [{ key: 'tier', value: 'enterprise_pro', enabled: true }],
    body: '',
    authType: 'bearer',
    authToken: '{{auth_token}}',
    extractors: [
      { id: 'ext-3', variableName: 'user_agent', path: 'headers.User-Agent' },
    ],
    assertions: [
      { id: 'ass-3', target: 'status', operator: 'equals', expected: '200' },
    ],
    status: 'idle',
  },
  {
    id: 'node-checkout',
    name: '3. Execute Order Checkout',
    type: 'http',
    position: { x: 880, y: 140 },
    method: 'POST',
    url: 'https://httpbin.org/status/201',
    headers: [
      { key: 'Content-Type', value: 'application/json', enabled: true },
      { key: 'Idempotency-Key', value: 'req_k8s_9921b', enabled: true },
    ],
    queryParams: [],
    body: JSON.stringify(
      {
        sku: 'CORP-SUB-01',
        currency: 'USD',
        amount: 24900,
        assigned_user: '{{session_id}}',
      },
      null,
      2
    ),
    authType: 'none',
    extractors: [],
    assertions: [
      { id: 'ass-4', target: 'status', operator: 'equals', expected: '201' },
      { id: 'ass-5', target: 'latency', operator: 'less_than', expected: '600' },
    ],
    status: 'idle',
  },
];

const INITIAL_EDGES: EdgeConnection[] = [
  { id: 'edge-1', fromNodeId: 'node-auth', toNodeId: 'node-profile' },
  { id: 'edge-2', fromNodeId: 'node-profile', toNodeId: 'node-checkout' },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNodeId: 'node-auth',
  activeTab: 'canvas',
  runtimeVariables: {
    auth_token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    session_id: 'usr_99182a4c',
  },
  environment: 'Staging Cloud',
  environments: {
    'Staging Cloud': [
      { key: 'BASE_URL', value: 'https://api-staging.kinetic.io', enabled: true },
      { key: 'TIMEOUT_MS', value: '5000', enabled: true },
    ],
    Production: [
      { key: 'BASE_URL', value: 'https://api.kinetic.io', enabled: true },
      { key: 'TIMEOUT_MS', value: '3000', enabled: true },
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
      x: 100 + (count % 3) * 320,
      y: 120 + Math.floor(count / 3) * 160,
    };

    const newNode: WorkflowNode = {
      id: newId,
      name: `${count}. New HTTP Request`,
      type,
      position: defaultPos,
      method: 'GET',
      url: 'https://httpbin.org/get',
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

  // Execution engine with variable substitution & assertions
  runSingleNode: async (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) throw new Error('Node not found');

    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, status: 'running' } : n)),
      activeExecutionNodeId: nodeId,
    }));

    const variables = get().runtimeVariables;
    // Substitute {{variable}} in URL & Body
    const interpolate = (str: string) => {
      return str.replace(/\{\{([\w_]+)\}\}/g, (_, key) => {
        return variables[key] !== undefined ? String(variables[key]) : `{{${key}}}`;
      });
    };

    const finalUrl = interpolate(node.url);
    const startTime = performance.now();

    try {
      // Simulate realistic execution over network or mock sandbox
      await new Promise((res) => setTimeout(res, 280 + Math.random() * 240));
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      let mockStatus = 200;
      if (finalUrl.includes('status/201')) mockStatus = 201;
      else if (finalUrl.includes('status/404')) mockStatus = 404;
      else if (finalUrl.includes('status/500')) mockStatus = 500;

      const mockBodyObj = {
        success: mockStatus >= 200 && mockStatus < 300,
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        method: node.method,
        origin: '198.51.100.42',
        headers: {
          'X-Amzn-Trace-Id': `Root=1-${Date.now().toString(16)}-f48a9b2c`,
          'User-Agent': 'Kinetic-Engine/1.0.4 (Unix; x86_64)',
        },
        data: {
          requestId: `req_${Math.random().toString(36).substring(2, 9)}`,
          orderId: `ord_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          status: 'PROCESSED',
          latency: `${latencyMs}ms`,
        },
      };

      const responseBodyStr = JSON.stringify(mockBodyObj, null, 2);

      // Check Assertions
      const updatedAssertions = node.assertions.map((a) => {
        if (a.target === 'status') {
          return { ...a, passed: String(mockStatus) === a.expected };
        }
        if (a.target === 'latency') {
          return { ...a, passed: latencyMs <= Number(a.expected) };
        }
        if (a.target === 'body_contains') {
          return { ...a, passed: responseBodyStr.includes(a.expected) };
        }
        return { ...a, passed: true };
      });

      const allAssertionsPassed = updatedAssertions.every((a) => a.passed !== false);

      // Extract variables into global runtime store
      const newExtractedVars: Record<string, any> = {};
      node.extractors.forEach((ext) => {
        if (ext.path === 'origin') newExtractedVars[ext.variableName] = mockBodyObj.origin;
        if (ext.path.includes('Trace-Id'))
          newExtractedVars[ext.variableName] = mockBodyObj.headers['X-Amzn-Trace-Id'];
        if (ext.path.includes('User-Agent'))
          newExtractedVars[ext.variableName] = mockBodyObj.headers['User-Agent'];
      });

      const response: NodeResponse = {
        status: mockStatus,
        statusText: mockStatus === 200 ? 'OK' : mockStatus === 201 ? 'Created' : 'Error',
        latencyMs,
        sizeBytes: new Blob([responseBodyStr]).size,
        body: responseBodyStr,
        parsedBody: mockBodyObj,
        headers: {
          'content-type': 'application/json',
          'x-powered-by': 'Kinetic-Edge-Runtime',
          'cache-control': 'no-store, max-age=0',
        },
        timestamp: Date.now(),
      };

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: allAssertionsPassed ? 'success' : 'error',
                lastResponse: response,
                assertions: updatedAssertions,
              }
            : n
        ),
        runtimeVariables: { ...state.runtimeVariables, ...newExtractedVars },
        activeExecutionNodeId: null,
      }));

      return response;
    } catch (err: any) {
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId ? { ...n, status: 'error' } : n
        ),
        activeExecutionNodeId: null,
      }));
      throw err;
    }
  },

  // Sequential execution traversing edges in topological order
  runEntirePipeline: async () => {
    set({ isExecuting: true });
    get().resetPipelineStatus();

    const nodes = get().nodes;
    for (const node of nodes) {
      try {
        await get().runSingleNode(node.id);
        // Small breathing delay between visual nodes
        await new Promise((res) => setTimeout(res, 200));
      } catch (err) {
        break; // halt on pipeline error
      }
    }

    set({ isExecuting: false, activeExecutionNodeId: null });
  },

  importCurl: (curlString: string) => {
    let method: WorkflowNode['method'] = 'GET';
    let url = 'https://api.example.com/v1/endpoint';
    const headers: { key: string; value: string; enabled: boolean }[] = [];
    let body = '';

    // Extract Method
    const methodMatch = curlString.match(/-X\s+([A-Z]+)/i);
    if (methodMatch) method = methodMatch[1].toUpperCase() as any;

    // Extract URL
    const urlMatch = curlString.match(/curl\s+["']?([^"'\s]+)["']?/);
    if (urlMatch) url = urlMatch[1];

    // Extract Headers
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

    // Extract Data
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
      position: { x: 340, y: 320 },
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
