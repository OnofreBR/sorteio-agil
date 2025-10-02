-- Create indexing_logs table for monitoring
CREATE TABLE IF NOT EXISTS public.indexing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  service TEXT NOT NULL CHECK (service IN ('google', 'indexnow', 'batch')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  response_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_indexing_logs_created_at ON public.indexing_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_indexing_logs_service ON public.indexing_logs(service);
CREATE INDEX IF NOT EXISTS idx_indexing_logs_status ON public.indexing_logs(status);

-- Enable RLS
ALTER TABLE public.indexing_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for monitoring dashboard)
CREATE POLICY "Allow public read access" ON public.indexing_logs
  FOR SELECT
  USING (true);

-- Allow service role to insert logs (edge functions will use service role)
CREATE POLICY "Allow service role insert" ON public.indexing_logs
  FOR INSERT
  WITH CHECK (true);