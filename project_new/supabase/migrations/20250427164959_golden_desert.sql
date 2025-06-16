/*
  # Initial Schema Setup for Airline Tail Assignment System

  1. New Tables
    - `aircraft`
      - `id` (uuid, primary key)
      - `type` (text)
      - `capacity` (integer)
      - `current_location` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `crew`
      - `id` (uuid, primary key)
      - `name` (text)
      - `qualifications` (text[])
      - `duty_hours` (integer)
      - `rest_until` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `flights`
      - `id` (uuid, primary key)
      - `flight_number` (text)
      - `origin` (text)
      - `destination` (text)
      - `departure_time` (timestamp)
      - `arrival_time` (timestamp)
      - `aircraft_id` (uuid, foreign key)
      - `crew_ids` (uuid[])
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create aircraft table
CREATE TABLE IF NOT EXISTS aircraft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  capacity integer NOT NULL,
  current_location text NOT NULL,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crew table
CREATE TABLE IF NOT EXISTS crew (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  qualifications text[] NOT NULL,
  duty_hours integer DEFAULT 0,
  rest_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  aircraft_id uuid REFERENCES aircraft(id),
  crew_ids uuid[],
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access" ON aircraft
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON crew
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON flights
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert access" ON aircraft
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated insert access" ON crew
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated insert access" ON flights
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update access" ON aircraft
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated update access" ON crew
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated update access" ON flights
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aircraft_status ON aircraft(status);
CREATE INDEX IF NOT EXISTS idx_crew_rest_until ON crew(rest_until);
CREATE INDEX IF NOT EXISTS idx_flights_departure ON flights(departure_time);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);