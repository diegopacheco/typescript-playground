/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  ObjectID: { input: any; output: any };
  _Any: { input: any; output: any };
  federation__FieldSet: { input: any; output: any };
  link__Import: { input: any; output: any };
  timestamptz: { input: any; output: any };
  uuid: { input: any; output: any };
}

export interface CapsulesFind {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  landings?: InputMaybe<Scalars["Int"]["input"]>;
  mission?: InputMaybe<Scalars["String"]["input"]>;
  original_launch?: InputMaybe<Scalars["Date"]["input"]>;
  reuse_count?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
}

export interface CoresFind {
  asds_attempts?: InputMaybe<Scalars["Int"]["input"]>;
  asds_landings?: InputMaybe<Scalars["Int"]["input"]>;
  block?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  missions?: InputMaybe<Scalars["String"]["input"]>;
  original_launch?: InputMaybe<Scalars["Date"]["input"]>;
  reuse_count?: InputMaybe<Scalars["Int"]["input"]>;
  rtls_attempts?: InputMaybe<Scalars["Int"]["input"]>;
  rtls_landings?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  water_landing?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface HistoryFind {
  end?: InputMaybe<Scalars["Date"]["input"]>;
  flight_number?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  start?: InputMaybe<Scalars["Date"]["input"]>;
}

export interface LaunchFind {
  apoapsis_km?: InputMaybe<Scalars["Float"]["input"]>;
  block?: InputMaybe<Scalars["Int"]["input"]>;
  cap_serial?: InputMaybe<Scalars["String"]["input"]>;
  capsule_reuse?: InputMaybe<Scalars["String"]["input"]>;
  core_flight?: InputMaybe<Scalars["Int"]["input"]>;
  core_reuse?: InputMaybe<Scalars["String"]["input"]>;
  core_serial?: InputMaybe<Scalars["String"]["input"]>;
  customer?: InputMaybe<Scalars["String"]["input"]>;
  eccentricity?: InputMaybe<Scalars["Float"]["input"]>;
  end?: InputMaybe<Scalars["Date"]["input"]>;
  epoch?: InputMaybe<Scalars["Date"]["input"]>;
  fairings_recovered?: InputMaybe<Scalars["String"]["input"]>;
  fairings_recovery_attempt?: InputMaybe<Scalars["String"]["input"]>;
  fairings_reuse?: InputMaybe<Scalars["String"]["input"]>;
  fairings_reused?: InputMaybe<Scalars["String"]["input"]>;
  fairings_ship?: InputMaybe<Scalars["String"]["input"]>;
  gridfins?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  inclination_deg?: InputMaybe<Scalars["Float"]["input"]>;
  land_success?: InputMaybe<Scalars["String"]["input"]>;
  landing_intent?: InputMaybe<Scalars["String"]["input"]>;
  landing_type?: InputMaybe<Scalars["String"]["input"]>;
  landing_vehicle?: InputMaybe<Scalars["String"]["input"]>;
  launch_date_local?: InputMaybe<Scalars["Date"]["input"]>;
  launch_date_utc?: InputMaybe<Scalars["Date"]["input"]>;
  launch_success?: InputMaybe<Scalars["String"]["input"]>;
  launch_year?: InputMaybe<Scalars["String"]["input"]>;
  legs?: InputMaybe<Scalars["String"]["input"]>;
  lifespan_years?: InputMaybe<Scalars["Float"]["input"]>;
  longitude?: InputMaybe<Scalars["Float"]["input"]>;
  manufacturer?: InputMaybe<Scalars["String"]["input"]>;
  mean_motion?: InputMaybe<Scalars["Float"]["input"]>;
  mission_id?: InputMaybe<Scalars["String"]["input"]>;
  mission_name?: InputMaybe<Scalars["String"]["input"]>;
  nationality?: InputMaybe<Scalars["String"]["input"]>;
  norad_id?: InputMaybe<Scalars["Int"]["input"]>;
  orbit?: InputMaybe<Scalars["String"]["input"]>;
  payload_id?: InputMaybe<Scalars["String"]["input"]>;
  payload_type?: InputMaybe<Scalars["String"]["input"]>;
  periapsis_km?: InputMaybe<Scalars["Float"]["input"]>;
  period_min?: InputMaybe<Scalars["Float"]["input"]>;
  raan?: InputMaybe<Scalars["Float"]["input"]>;
  reference_system?: InputMaybe<Scalars["String"]["input"]>;
  regime?: InputMaybe<Scalars["String"]["input"]>;
  reused?: InputMaybe<Scalars["String"]["input"]>;
  rocket_id?: InputMaybe<Scalars["String"]["input"]>;
  rocket_name?: InputMaybe<Scalars["String"]["input"]>;
  rocket_type?: InputMaybe<Scalars["String"]["input"]>;
  second_stage_block?: InputMaybe<Scalars["String"]["input"]>;
  semi_major_axis_km?: InputMaybe<Scalars["Float"]["input"]>;
  ship?: InputMaybe<Scalars["String"]["input"]>;
  side_core1_reuse?: InputMaybe<Scalars["String"]["input"]>;
  side_core2_reuse?: InputMaybe<Scalars["String"]["input"]>;
  site_id?: InputMaybe<Scalars["String"]["input"]>;
  site_name?: InputMaybe<Scalars["String"]["input"]>;
  site_name_long?: InputMaybe<Scalars["String"]["input"]>;
  start?: InputMaybe<Scalars["Date"]["input"]>;
  tbd?: InputMaybe<Scalars["String"]["input"]>;
  tentative?: InputMaybe<Scalars["String"]["input"]>;
  tentative_max_precision?: InputMaybe<Scalars["String"]["input"]>;
}

export interface MissionsFind {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  manufacturer?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  payload_id?: InputMaybe<Scalars["String"]["input"]>;
}

export interface PayloadsFind {
  apoapsis_km?: InputMaybe<Scalars["Float"]["input"]>;
  customer?: InputMaybe<Scalars["String"]["input"]>;
  eccentricity?: InputMaybe<Scalars["Float"]["input"]>;
  epoch?: InputMaybe<Scalars["Date"]["input"]>;
  inclination_deg?: InputMaybe<Scalars["Float"]["input"]>;
  lifespan_years?: InputMaybe<Scalars["Float"]["input"]>;
  longitude?: InputMaybe<Scalars["Float"]["input"]>;
  manufacturer?: InputMaybe<Scalars["String"]["input"]>;
  mean_motion?: InputMaybe<Scalars["Float"]["input"]>;
  nationality?: InputMaybe<Scalars["String"]["input"]>;
  norad_id?: InputMaybe<Scalars["Int"]["input"]>;
  orbit?: InputMaybe<Scalars["String"]["input"]>;
  payload_id?: InputMaybe<Scalars["ID"]["input"]>;
  payload_type?: InputMaybe<Scalars["String"]["input"]>;
  periapsis_km?: InputMaybe<Scalars["Float"]["input"]>;
  period_min?: InputMaybe<Scalars["Float"]["input"]>;
  raan?: InputMaybe<Scalars["Float"]["input"]>;
  reference_system?: InputMaybe<Scalars["String"]["input"]>;
  regime?: InputMaybe<Scalars["String"]["input"]>;
  reused?: InputMaybe<Scalars["Boolean"]["input"]>;
  semi_major_axis_km?: InputMaybe<Scalars["Float"]["input"]>;
}

export interface ShipsFind {
  abs?: InputMaybe<Scalars["Int"]["input"]>;
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  attempted_landings?: InputMaybe<Scalars["Int"]["input"]>;
  class?: InputMaybe<Scalars["Int"]["input"]>;
  course_deg?: InputMaybe<Scalars["Int"]["input"]>;
  home_port?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  imo?: InputMaybe<Scalars["Int"]["input"]>;
  latitude?: InputMaybe<Scalars["Float"]["input"]>;
  longitude?: InputMaybe<Scalars["Float"]["input"]>;
  mission?: InputMaybe<Scalars["String"]["input"]>;
  mmsi?: InputMaybe<Scalars["Int"]["input"]>;
  model?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  speed_kn?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  successful_landings?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  weight_kg?: InputMaybe<Scalars["Int"]["input"]>;
  weight_lbs?: InputMaybe<Scalars["Int"]["input"]>;
  year_built?: InputMaybe<Scalars["Int"]["input"]>;
}

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export interface String_comparison_exp {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  _similar?: InputMaybe<Scalars["String"]["input"]>;
}

/** conflict action */
export type conflict_action =
  /** ignore the insert on this row */
  | "ignore"
  /** update the row with the given values */
  | "update";

export type link__Purpose =
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  | "EXECUTION"
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  | "SECURITY";

/** column ordering options */
export type order_by =
  /** in the ascending order, nulls last */
  | "asc"
  /** in the ascending order, nulls first */
  | "asc_nulls_first"
  /** in the ascending order, nulls last */
  | "asc_nulls_last"
  /** in the descending order, nulls first */
  | "desc"
  /** in the descending order, nulls first */
  | "desc_nulls_first"
  /** in the descending order, nulls last */
  | "desc_nulls_last";

/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export interface timestamptz_comparison_exp {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
}

/** order by aggregate values of table "users" */
export interface users_aggregate_order_by {
  count?: InputMaybe<order_by>;
  max?: InputMaybe<users_max_order_by>;
  min?: InputMaybe<users_min_order_by>;
}

/** input type for inserting array relation for remote table "users" */
export interface users_arr_rel_insert_input {
  data: Array<users_insert_input>;
  on_conflict?: InputMaybe<users_on_conflict>;
}

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export interface users_bool_exp {
  _and?: InputMaybe<Array<InputMaybe<users_bool_exp>>>;
  _not?: InputMaybe<users_bool_exp>;
  _or?: InputMaybe<Array<InputMaybe<users_bool_exp>>>;
  id?: InputMaybe<uuid_comparison_exp>;
  name?: InputMaybe<String_comparison_exp>;
  rocket?: InputMaybe<String_comparison_exp>;
  timestamp?: InputMaybe<timestamptz_comparison_exp>;
  twitter?: InputMaybe<String_comparison_exp>;
}

/** unique or primary key constraints on table "users" */
export type users_constraint =
  | "constraint"
  | "key"
  | "or"
  | "primary"
  | "unique"
  | "users_pkey";

/** input type for inserting data into table "users" */
export interface users_insert_input {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rocket?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  twitter?: InputMaybe<Scalars["String"]["input"]>;
}

/** order by max() on columns of table "users" */
export interface users_max_order_by {
  name?: InputMaybe<order_by>;
  rocket?: InputMaybe<order_by>;
  timestamp?: InputMaybe<order_by>;
  twitter?: InputMaybe<order_by>;
}

/** order by min() on columns of table "users" */
export interface users_min_order_by {
  name?: InputMaybe<order_by>;
  rocket?: InputMaybe<order_by>;
  timestamp?: InputMaybe<order_by>;
  twitter?: InputMaybe<order_by>;
}

/** input type for inserting object relation for remote table "users" */
export interface users_obj_rel_insert_input {
  data: users_insert_input;
  on_conflict?: InputMaybe<users_on_conflict>;
}

/** on conflict condition type for table "users" */
export interface users_on_conflict {
  constraint: users_constraint;
  update_columns: Array<users_update_column>;
}

/** ordering options when selecting data from "users" */
export interface users_order_by {
  id?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  rocket?: InputMaybe<order_by>;
  timestamp?: InputMaybe<order_by>;
  twitter?: InputMaybe<order_by>;
}

/** select columns of table "users" */
export type users_select_column =
  | "column"
  | "id"
  | "name"
  | "rocket"
  | "timestamp"
  | "twitter";

/** input type for updating data in table "users" */
export interface users_set_input {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rocket?: InputMaybe<Scalars["String"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  twitter?: InputMaybe<Scalars["String"]["input"]>;
}

/** update columns of table "users" */
export type users_update_column =
  | "column"
  | "id"
  | "name"
  | "rocket"
  | "timestamp"
  | "twitter";

/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
export interface uuid_comparison_exp {
  _eq?: InputMaybe<Scalars["uuid"]["input"]>;
  _gt?: InputMaybe<Scalars["uuid"]["input"]>;
  _gte?: InputMaybe<Scalars["uuid"]["input"]>;
  _in?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["uuid"]["input"]>;
  _lte?: InputMaybe<Scalars["uuid"]["input"]>;
  _neq?: InputMaybe<Scalars["uuid"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
}

export declare const scalarsEnumsHash: ScalarsEnumsHash;
export declare const generatedSchema: {
  Address: {
    __typename: { __type: "String!" };
    address: { __type: "String" };
    city: { __type: "String" };
    state: { __type: "String" };
  };
  Capsule: {
    __typename: { __type: "String!" };
    dragon: { __type: "Dragon" };
    id: { __type: "ID" };
    landings: { __type: "Int" };
    missions: { __type: "[CapsuleMission]" };
    original_launch: { __type: "Date" };
    reuse_count: { __type: "Int" };
    status: { __type: "String" };
    type: { __type: "String" };
  };
  CapsuleMission: {
    __typename: { __type: "String!" };
    flight: { __type: "Int" };
    name: { __type: "String" };
  };
  CapsulesFind: {
    id: { __type: "ID" };
    landings: { __type: "Int" };
    mission: { __type: "String" };
    original_launch: { __type: "Date" };
    reuse_count: { __type: "Int" };
    status: { __type: "String" };
    type: { __type: "String" };
  };
  Core: {
    __typename: { __type: "String!" };
    asds_attempts: { __type: "Int" };
    asds_landings: { __type: "Int" };
    block: { __type: "Int" };
    id: { __type: "ID" };
    missions: { __type: "[CapsuleMission]" };
    original_launch: { __type: "Date" };
    reuse_count: { __type: "Int" };
    rtls_attempts: { __type: "Int" };
    rtls_landings: { __type: "Int" };
    status: { __type: "String" };
    water_landing: { __type: "Boolean" };
  };
  CoreMission: {
    __typename: { __type: "String!" };
    flight: { __type: "Int" };
    name: { __type: "String" };
  };
  CoresFind: {
    asds_attempts: { __type: "Int" };
    asds_landings: { __type: "Int" };
    block: { __type: "Int" };
    id: { __type: "String" };
    missions: { __type: "String" };
    original_launch: { __type: "Date" };
    reuse_count: { __type: "Int" };
    rtls_attempts: { __type: "Int" };
    rtls_landings: { __type: "Int" };
    status: { __type: "String" };
    water_landing: { __type: "Boolean" };
  };
  Distance: {
    __typename: { __type: "String!" };
    feet: { __type: "Float" };
    meters: { __type: "Float" };
  };
  Dragon: {
    __typename: { __type: "String!" };
    active: { __type: "Boolean" };
    crew_capacity: { __type: "Int" };
    description: { __type: "String" };
    diameter: { __type: "Distance" };
    dry_mass_kg: { __type: "Int" };
    dry_mass_lb: { __type: "Int" };
    first_flight: { __type: "String" };
    heat_shield: { __type: "DragonHeatShield" };
    height_w_trunk: { __type: "Distance" };
    id: { __type: "ID" };
    launch_payload_mass: { __type: "Mass" };
    launch_payload_vol: { __type: "Volume" };
    name: { __type: "String" };
    orbit_duration_yr: { __type: "Int" };
    pressurized_capsule: { __type: "DragonPressurizedCapsule" };
    return_payload_mass: { __type: "Mass" };
    return_payload_vol: { __type: "Volume" };
    sidewall_angle_deg: { __type: "Float" };
    thrusters: { __type: "[DragonThrust]" };
    trunk: { __type: "DragonTrunk" };
    type: { __type: "String" };
    wikipedia: { __type: "String" };
  };
  DragonHeatShield: {
    __typename: { __type: "String!" };
    dev_partner: { __type: "String" };
    material: { __type: "String" };
    size_meters: { __type: "Float" };
    temp_degrees: { __type: "Int" };
  };
  DragonPressurizedCapsule: {
    __typename: { __type: "String!" };
    payload_volume: { __type: "Volume" };
  };
  DragonThrust: {
    __typename: { __type: "String!" };
    amount: { __type: "Int" };
    fuel_1: { __type: "String" };
    fuel_2: { __type: "String" };
    pods: { __type: "Int" };
    thrust: { __type: "Force" };
    type: { __type: "String" };
  };
  DragonTrunk: {
    __typename: { __type: "String!" };
    cargo: { __type: "DragonTrunkCargo" };
    trunk_volume: { __type: "Volume" };
  };
  DragonTrunkCargo: {
    __typename: { __type: "String!" };
    solar_array: { __type: "Int" };
    unpressurized_cargo: { __type: "Boolean" };
  };
  Force: {
    __typename: { __type: "String!" };
    kN: { __type: "Float" };
    lbf: { __type: "Float" };
  };
  HistoriesResult: {
    __typename: { __type: "String!" };
    data: { __type: "[History]" };
    result: { __type: "Result" };
  };
  History: {
    __typename: { __type: "String!" };
    details: { __type: "String" };
    event_date_unix: { __type: "Date" };
    event_date_utc: { __type: "Date" };
    flight: { __type: "Launch" };
    id: { __type: "ID" };
    links: { __type: "Link" };
    title: { __type: "String" };
  };
  HistoryFind: {
    end: { __type: "Date" };
    flight_number: { __type: "Int" };
    id: { __type: "ID" };
    start: { __type: "Date" };
  };
  Info: {
    __typename: { __type: "String!" };
    ceo: { __type: "String" };
    coo: { __type: "String" };
    cto: { __type: "String" };
    cto_propulsion: { __type: "String" };
    employees: { __type: "Int" };
    founded: { __type: "Int" };
    founder: { __type: "String" };
    headquarters: { __type: "Address" };
    launch_sites: { __type: "Int" };
    links: { __type: "InfoLinks" };
    name: { __type: "String" };
    summary: { __type: "String" };
    test_sites: { __type: "Int" };
    valuation: { __type: "Float" };
    vehicles: { __type: "Int" };
  };
  InfoLinks: {
    __typename: { __type: "String!" };
    elon_twitter: { __type: "String" };
    flickr: { __type: "String" };
    twitter: { __type: "String" };
    website: { __type: "String" };
  };
  Landpad: {
    __typename: { __type: "String!" };
    attempted_landings: { __type: "String" };
    details: { __type: "String" };
    full_name: { __type: "String" };
    id: { __type: "ID" };
    landing_type: { __type: "String" };
    location: { __type: "Location" };
    status: { __type: "String" };
    successful_landings: { __type: "String" };
    wikipedia: { __type: "String" };
  };
  Launch: {
    __typename: { __type: "String!" };
    details: { __type: "String" };
    id: { __type: "ID" };
    is_tentative: { __type: "Boolean" };
    launch_date_local: { __type: "Date" };
    launch_date_unix: { __type: "Date" };
    launch_date_utc: { __type: "Date" };
    launch_site: { __type: "LaunchSite" };
    launch_success: { __type: "Boolean" };
    launch_year: { __type: "String" };
    links: { __type: "LaunchLinks" };
    mission_id: { __type: "[String]" };
    mission_name: { __type: "String" };
    rocket: { __type: "LaunchRocket" };
    ships: { __type: "[Ship]" };
    static_fire_date_unix: { __type: "Date" };
    static_fire_date_utc: { __type: "Date" };
    telemetry: { __type: "LaunchTelemetry" };
    tentative_max_precision: { __type: "String" };
    upcoming: { __type: "Boolean" };
  };
  LaunchFind: {
    apoapsis_km: { __type: "Float" };
    block: { __type: "Int" };
    cap_serial: { __type: "String" };
    capsule_reuse: { __type: "String" };
    core_flight: { __type: "Int" };
    core_reuse: { __type: "String" };
    core_serial: { __type: "String" };
    customer: { __type: "String" };
    eccentricity: { __type: "Float" };
    end: { __type: "Date" };
    epoch: { __type: "Date" };
    fairings_recovered: { __type: "String" };
    fairings_recovery_attempt: { __type: "String" };
    fairings_reuse: { __type: "String" };
    fairings_reused: { __type: "String" };
    fairings_ship: { __type: "String" };
    gridfins: { __type: "String" };
    id: { __type: "ID" };
    inclination_deg: { __type: "Float" };
    land_success: { __type: "String" };
    landing_intent: { __type: "String" };
    landing_type: { __type: "String" };
    landing_vehicle: { __type: "String" };
    launch_date_local: { __type: "Date" };
    launch_date_utc: { __type: "Date" };
    launch_success: { __type: "String" };
    launch_year: { __type: "String" };
    legs: { __type: "String" };
    lifespan_years: { __type: "Float" };
    longitude: { __type: "Float" };
    manufacturer: { __type: "String" };
    mean_motion: { __type: "Float" };
    mission_id: { __type: "String" };
    mission_name: { __type: "String" };
    nationality: { __type: "String" };
    norad_id: { __type: "Int" };
    orbit: { __type: "String" };
    payload_id: { __type: "String" };
    payload_type: { __type: "String" };
    periapsis_km: { __type: "Float" };
    period_min: { __type: "Float" };
    raan: { __type: "Float" };
    reference_system: { __type: "String" };
    regime: { __type: "String" };
    reused: { __type: "String" };
    rocket_id: { __type: "String" };
    rocket_name: { __type: "String" };
    rocket_type: { __type: "String" };
    second_stage_block: { __type: "String" };
    semi_major_axis_km: { __type: "Float" };
    ship: { __type: "String" };
    side_core1_reuse: { __type: "String" };
    side_core2_reuse: { __type: "String" };
    site_id: { __type: "String" };
    site_name: { __type: "String" };
    site_name_long: { __type: "String" };
    start: { __type: "Date" };
    tbd: { __type: "String" };
    tentative: { __type: "String" };
    tentative_max_precision: { __type: "String" };
  };
  LaunchLinks: {
    __typename: { __type: "String!" };
    article_link: { __type: "String" };
    flickr_images: { __type: "[String]" };
    mission_patch: { __type: "String" };
    mission_patch_small: { __type: "String" };
    presskit: { __type: "String" };
    reddit_campaign: { __type: "String" };
    reddit_launch: { __type: "String" };
    reddit_media: { __type: "String" };
    reddit_recovery: { __type: "String" };
    video_link: { __type: "String" };
    wikipedia: { __type: "String" };
  };
  LaunchRocket: {
    __typename: { __type: "String!" };
    fairings: { __type: "LaunchRocketFairings" };
    first_stage: { __type: "LaunchRocketFirstStage" };
    rocket: { __type: "Rocket" };
    rocket_name: { __type: "String" };
    rocket_type: { __type: "String" };
    second_stage: { __type: "LaunchRocketSecondStage" };
  };
  LaunchRocketFairings: {
    __typename: { __type: "String!" };
    recovered: { __type: "Boolean" };
    recovery_attempt: { __type: "Boolean" };
    reused: { __type: "Boolean" };
    ship: { __type: "String" };
  };
  LaunchRocketFirstStage: {
    __typename: { __type: "String!" };
    cores: { __type: "[LaunchRocketFirstStageCore]" };
  };
  LaunchRocketFirstStageCore: {
    __typename: { __type: "String!" };
    block: { __type: "Int" };
    core: { __type: "Core" };
    flight: { __type: "Int" };
    gridfins: { __type: "Boolean" };
    land_success: { __type: "Boolean" };
    landing_intent: { __type: "Boolean" };
    landing_type: { __type: "String" };
    landing_vehicle: { __type: "String" };
    legs: { __type: "Boolean" };
    reused: { __type: "Boolean" };
  };
  LaunchRocketSecondStage: {
    __typename: { __type: "String!" };
    block: { __type: "Int" };
    payloads: { __type: "[Payload]" };
  };
  LaunchSite: {
    __typename: { __type: "String!" };
    site_id: { __type: "String" };
    site_name: { __type: "String" };
    site_name_long: { __type: "String" };
  };
  LaunchTelemetry: {
    __typename: { __type: "String!" };
    flight_club: { __type: "String" };
  };
  LaunchesPastResult: {
    __typename: { __type: "String!" };
    data: { __type: "[Launch]" };
    result: { __type: "Result" };
  };
  Launchpad: {
    __typename: { __type: "String!" };
    attempted_launches: { __type: "Int" };
    details: { __type: "String" };
    id: { __type: "ID" };
    location: { __type: "Location" };
    name: { __type: "String" };
    status: { __type: "String" };
    successful_launches: { __type: "Int" };
    vehicles_launched: { __type: "[Rocket]" };
    wikipedia: { __type: "String" };
  };
  Link: {
    __typename: { __type: "String!" };
    article: { __type: "String" };
    reddit: { __type: "String" };
    wikipedia: { __type: "String" };
  };
  Location: {
    __typename: { __type: "String!" };
    latitude: { __type: "Float" };
    longitude: { __type: "Float" };
    name: { __type: "String" };
    region: { __type: "String" };
  };
  Mass: {
    __typename: { __type: "String!" };
    kg: { __type: "Int" };
    lb: { __type: "Int" };
  };
  Mission: {
    __typename: { __type: "String!" };
    description: { __type: "String" };
    id: { __type: "ID" };
    manufacturers: { __type: "[String]" };
    name: { __type: "String" };
    payloads: { __type: "[Payload]" };
    twitter: { __type: "String" };
    website: { __type: "String" };
    wikipedia: { __type: "String" };
  };
  MissionResult: {
    __typename: { __type: "String!" };
    data: { __type: "[Mission]" };
    result: { __type: "Result" };
  };
  MissionsFind: {
    id: { __type: "ID" };
    manufacturer: { __type: "String" };
    name: { __type: "String" };
    payload_id: { __type: "String" };
  };
  Payload: {
    __typename: { __type: "String!" };
    customers: { __type: "[String]" };
    id: { __type: "ID" };
    manufacturer: { __type: "String" };
    nationality: { __type: "String" };
    norad_id: { __type: "[Int]" };
    orbit: { __type: "String" };
    orbit_params: { __type: "PayloadOrbitParams" };
    payload_mass_kg: { __type: "Float" };
    payload_mass_lbs: { __type: "Float" };
    payload_type: { __type: "String" };
    reused: { __type: "Boolean" };
  };
  PayloadOrbitParams: {
    __typename: { __type: "String!" };
    apoapsis_km: { __type: "Float" };
    arg_of_pericenter: { __type: "Float" };
    eccentricity: { __type: "Float" };
    epoch: { __type: "Date" };
    inclination_deg: { __type: "Float" };
    lifespan_years: { __type: "Float" };
    longitude: { __type: "Float" };
    mean_anomaly: { __type: "Float" };
    mean_motion: { __type: "Float" };
    periapsis_km: { __type: "Float" };
    period_min: { __type: "Float" };
    raan: { __type: "Float" };
    reference_system: { __type: "String" };
    regime: { __type: "String" };
    semi_major_axis_km: { __type: "Float" };
  };
  PayloadsFind: {
    apoapsis_km: { __type: "Float" };
    customer: { __type: "String" };
    eccentricity: { __type: "Float" };
    epoch: { __type: "Date" };
    inclination_deg: { __type: "Float" };
    lifespan_years: { __type: "Float" };
    longitude: { __type: "Float" };
    manufacturer: { __type: "String" };
    mean_motion: { __type: "Float" };
    nationality: { __type: "String" };
    norad_id: { __type: "Int" };
    orbit: { __type: "String" };
    payload_id: { __type: "ID" };
    payload_type: { __type: "String" };
    periapsis_km: { __type: "Float" };
    period_min: { __type: "Float" };
    raan: { __type: "Float" };
    reference_system: { __type: "String" };
    regime: { __type: "String" };
    reused: { __type: "Boolean" };
    semi_major_axis_km: { __type: "Float" };
  };
  Result: { __typename: { __type: "String!" }; totalCount: { __type: "Int" } };
  Roadster: {
    __typename: { __type: "String!" };
    apoapsis_au: { __type: "Float" };
    details: { __type: "String" };
    earth_distance_km: { __type: "Float" };
    earth_distance_mi: { __type: "Float" };
    eccentricity: { __type: "Float" };
    epoch_jd: { __type: "Float" };
    inclination: { __type: "Float" };
    launch_date_unix: { __type: "Date" };
    launch_date_utc: { __type: "Date" };
    launch_mass_kg: { __type: "Int" };
    launch_mass_lbs: { __type: "Int" };
    longitude: { __type: "Float" };
    mars_distance_km: { __type: "Float" };
    mars_distance_mi: { __type: "Float" };
    name: { __type: "String" };
    norad_id: { __type: "Int" };
    orbit_type: { __type: "Float" };
    periapsis_arg: { __type: "Float" };
    periapsis_au: { __type: "Float" };
    period_days: { __type: "Float" };
    semi_major_axis_au: { __type: "Float" };
    speed_kph: { __type: "Float" };
    speed_mph: { __type: "Float" };
    wikipedia: { __type: "String" };
  };
  Rocket: {
    __typename: { __type: "String!" };
    active: { __type: "Boolean" };
    boosters: { __type: "Int" };
    company: { __type: "String" };
    cost_per_launch: { __type: "Int" };
    country: { __type: "String" };
    description: { __type: "String" };
    diameter: { __type: "Distance" };
    engines: { __type: "RocketEngines" };
    first_flight: { __type: "Date" };
    first_stage: { __type: "RocketFirstStage" };
    height: { __type: "Distance" };
    id: { __type: "ID" };
    landing_legs: { __type: "RocketLandingLegs" };
    mass: { __type: "Mass" };
    name: { __type: "String" };
    payload_weights: { __type: "[RocketPayloadWeight]" };
    second_stage: { __type: "RocketSecondStage" };
    stages: { __type: "Int" };
    success_rate_pct: { __type: "Int" };
    type: { __type: "String" };
    wikipedia: { __type: "String" };
  };
  RocketEngines: {
    __typename: { __type: "String!" };
    engine_loss_max: { __type: "String" };
    layout: { __type: "String" };
    number: { __type: "Int" };
    propellant_1: { __type: "String" };
    propellant_2: { __type: "String" };
    thrust_sea_level: { __type: "Force" };
    thrust_to_weight: { __type: "Float" };
    thrust_vacuum: { __type: "Force" };
    type: { __type: "String" };
    version: { __type: "String" };
  };
  RocketFirstStage: {
    __typename: { __type: "String!" };
    burn_time_sec: { __type: "Int" };
    engines: { __type: "Int" };
    fuel_amount_tons: { __type: "Float" };
    reusable: { __type: "Boolean" };
    thrust_sea_level: { __type: "Force" };
    thrust_vacuum: { __type: "Force" };
  };
  RocketLandingLegs: {
    __typename: { __type: "String!" };
    material: { __type: "String" };
    number: { __type: "Int" };
  };
  RocketPayloadWeight: {
    __typename: { __type: "String!" };
    id: { __type: "String" };
    kg: { __type: "Int" };
    lb: { __type: "Int" };
    name: { __type: "String" };
  };
  RocketSecondStage: {
    __typename: { __type: "String!" };
    burn_time_sec: { __type: "Int" };
    engines: { __type: "Int" };
    fuel_amount_tons: { __type: "Float" };
    payloads: { __type: "RocketSecondStagePayloads" };
    thrust: { __type: "Force" };
  };
  RocketSecondStagePayloadCompositeFairing: {
    __typename: { __type: "String!" };
    diameter: { __type: "Distance" };
    height: { __type: "Distance" };
  };
  RocketSecondStagePayloads: {
    __typename: { __type: "String!" };
    composite_fairing: { __type: "RocketSecondStagePayloadCompositeFairing" };
    option_1: { __type: "String" };
  };
  RocketsResult: {
    __typename: { __type: "String!" };
    data: { __type: "[Rocket]" };
    result: { __type: "Result" };
  };
  Ship: {
    __typename: { __type: "String!" };
    abs: { __type: "Int" };
    active: { __type: "Boolean" };
    attempted_landings: { __type: "Int" };
    class: { __type: "Int" };
    course_deg: { __type: "Int" };
    home_port: { __type: "String" };
    id: { __type: "ID" };
    image: { __type: "String" };
    imo: { __type: "Int" };
    missions: { __type: "[ShipMission]" };
    mmsi: { __type: "Int" };
    model: { __type: "String" };
    name: { __type: "String" };
    position: { __type: "ShipLocation" };
    roles: { __type: "[String]" };
    speed_kn: { __type: "Float" };
    status: { __type: "String" };
    successful_landings: { __type: "Int" };
    type: { __type: "String" };
    url: { __type: "String" };
    weight_kg: { __type: "Int" };
    weight_lbs: { __type: "Int" };
    year_built: { __type: "Int" };
  };
  ShipLocation: {
    __typename: { __type: "String!" };
    latitude: { __type: "Float" };
    longitude: { __type: "Float" };
  };
  ShipMission: {
    __typename: { __type: "String!" };
    flight: { __type: "String" };
    name: { __type: "String" };
  };
  ShipsFind: {
    abs: { __type: "Int" };
    active: { __type: "Boolean" };
    attempted_landings: { __type: "Int" };
    class: { __type: "Int" };
    course_deg: { __type: "Int" };
    home_port: { __type: "String" };
    id: { __type: "ID" };
    imo: { __type: "Int" };
    latitude: { __type: "Float" };
    longitude: { __type: "Float" };
    mission: { __type: "String" };
    mmsi: { __type: "Int" };
    model: { __type: "String" };
    name: { __type: "String" };
    role: { __type: "String" };
    speed_kn: { __type: "Int" };
    status: { __type: "String" };
    successful_landings: { __type: "Int" };
    type: { __type: "String" };
    weight_kg: { __type: "Int" };
    weight_lbs: { __type: "Int" };
    year_built: { __type: "Int" };
  };
  ShipsResult: {
    __typename: { __type: "String!" };
    data: { __type: "[Ship]" };
    result: { __type: "Result" };
  };
  String_comparison_exp: {
    _eq: { __type: "String" };
    _gt: { __type: "String" };
    _gte: { __type: "String" };
    _ilike: { __type: "String" };
    _in: { __type: "[String!]" };
    _is_null: { __type: "Boolean" };
    _like: { __type: "String" };
    _lt: { __type: "String" };
    _lte: { __type: "String" };
    _neq: { __type: "String" };
    _nilike: { __type: "String" };
    _nin: { __type: "[String!]" };
    _nlike: { __type: "String" };
    _nsimilar: { __type: "String" };
    _similar: { __type: "String" };
  };
  Volume: {
    __typename: { __type: "String!" };
    cubic_feet: { __type: "Int" };
    cubic_meters: { __type: "Int" };
  };
  _Service: { __typename: { __type: "String!" }; sdl: { __type: "String" } };
  mutation: {
    __typename: { __type: "String!" };
    delete_users: {
      __type: "users_mutation_response";
      __args: { where: "users_bool_exp!" };
    };
    insert_users: {
      __type: "users_mutation_response";
      __args: {
        objects: "[users_insert_input!]!";
        on_conflict: "users_on_conflict";
      };
    };
    update_users: {
      __type: "users_mutation_response";
      __args: { _set: "users_set_input"; where: "users_bool_exp!" };
    };
  };
  query: {
    __typename: { __type: "String!" };
    _service: { __type: "_Service!" };
    capsule: { __type: "Capsule"; __args: { id: "ID!" } };
    capsules: {
      __type: "[Capsule]";
      __args: {
        find: "CapsulesFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    capsulesPast: {
      __type: "[Capsule]";
      __args: {
        find: "CapsulesFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    capsulesUpcoming: {
      __type: "[Capsule]";
      __args: {
        find: "CapsulesFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    company: { __type: "Info" };
    core: { __type: "Core"; __args: { id: "ID!" } };
    cores: {
      __type: "[Core]";
      __args: {
        find: "CoresFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    coresPast: {
      __type: "[Core]";
      __args: {
        find: "CoresFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    coresUpcoming: {
      __type: "[Core]";
      __args: {
        find: "CoresFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    dragon: { __type: "Dragon"; __args: { id: "ID!" } };
    dragons: { __type: "[Dragon]"; __args: { limit: "Int"; offset: "Int" } };
    histories: {
      __type: "[History]";
      __args: {
        find: "HistoryFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    historiesResult: {
      __type: "HistoriesResult";
      __args: {
        find: "HistoryFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    history: { __type: "History"; __args: { id: "ID!" } };
    landpad: { __type: "Landpad"; __args: { id: "ID!" } };
    landpads: { __type: "[Landpad]"; __args: { limit: "Int"; offset: "Int" } };
    launch: { __type: "Launch"; __args: { id: "ID!" } };
    launchLatest: { __type: "Launch"; __args: { offset: "Int" } };
    launchNext: { __type: "Launch"; __args: { offset: "Int" } };
    launches: {
      __type: "[Launch]";
      __args: {
        find: "LaunchFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    launchesPast: {
      __type: "[Launch]";
      __args: {
        find: "LaunchFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    launchesPastResult: {
      __type: "LaunchesPastResult";
      __args: {
        find: "LaunchFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    launchesUpcoming: {
      __type: "[Launch]";
      __args: {
        find: "LaunchFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    launchpad: { __type: "Launchpad"; __args: { id: "ID!" } };
    launchpads: {
      __type: "[Launchpad]";
      __args: { limit: "Int"; offset: "Int" };
    };
    mission: { __type: "Mission"; __args: { id: "ID!" } };
    missions: {
      __type: "[Mission]";
      __args: { find: "MissionsFind"; limit: "Int"; offset: "Int" };
    };
    missionsResult: {
      __type: "MissionResult";
      __args: { find: "MissionsFind"; limit: "Int"; offset: "Int" };
    };
    payload: { __type: "Payload"; __args: { id: "ID!" } };
    payloads: {
      __type: "[Payload]";
      __args: {
        find: "PayloadsFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    roadster: { __type: "Roadster" };
    rocket: { __type: "Rocket"; __args: { id: "ID!" } };
    rockets: { __type: "[Rocket]"; __args: { limit: "Int"; offset: "Int" } };
    rocketsResult: {
      __type: "RocketsResult";
      __args: { limit: "Int"; offset: "Int" };
    };
    ship: { __type: "Ship"; __args: { id: "ID!" } };
    ships: {
      __type: "[Ship]";
      __args: {
        find: "ShipsFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    shipsResult: {
      __type: "ShipsResult";
      __args: {
        find: "ShipsFind";
        limit: "Int";
        offset: "Int";
        order: "String";
        sort: "String";
      };
    };
    users: {
      __type: "[users!]!";
      __args: {
        distinct_on: "[users_select_column!]";
        limit: "Int";
        offset: "Int";
        order_by: "[users_order_by!]";
        where: "users_bool_exp";
      };
    };
    users_aggregate: {
      __type: "users_aggregate!";
      __args: {
        distinct_on: "[users_select_column!]";
        limit: "Int";
        offset: "Int";
        order_by: "[users_order_by!]";
        where: "users_bool_exp";
      };
    };
    users_by_pk: { __type: "users"; __args: { id: "uuid!" } };
  };
  subscription: {
    __typename: { __type: "String!" };
    users: {
      __type: "[users!]!";
      __args: {
        distinct_on: "[users_select_column!]";
        limit: "Int";
        offset: "Int";
        order_by: "[users_order_by!]";
        where: "users_bool_exp";
      };
    };
    users_aggregate: {
      __type: "users_aggregate!";
      __args: {
        distinct_on: "[users_select_column!]";
        limit: "Int";
        offset: "Int";
        order_by: "[users_order_by!]";
        where: "users_bool_exp";
      };
    };
    users_by_pk: { __type: "users"; __args: { id: "uuid!" } };
  };
  timestamptz_comparison_exp: {
    _eq: { __type: "timestamptz" };
    _gt: { __type: "timestamptz" };
    _gte: { __type: "timestamptz" };
    _in: { __type: "[timestamptz!]" };
    _is_null: { __type: "Boolean" };
    _lt: { __type: "timestamptz" };
    _lte: { __type: "timestamptz" };
    _neq: { __type: "timestamptz" };
    _nin: { __type: "[timestamptz!]" };
  };
  users: {
    __typename: { __type: "String!" };
    id: { __type: "uuid!" };
    name: { __type: "String" };
    rocket: { __type: "String" };
    timestamp: { __type: "timestamptz!" };
    twitter: { __type: "String" };
  };
  users_aggregate: {
    __typename: { __type: "String!" };
    aggregate: { __type: "users_aggregate_fields" };
    nodes: { __type: "[users!]!" };
  };
  users_aggregate_fields: {
    __typename: { __type: "String!" };
    count: {
      __type: "Int";
      __args: { columns: "[users_select_column!]"; distinct: "Boolean" };
    };
    max: { __type: "users_max_fields" };
    min: { __type: "users_min_fields" };
  };
  users_aggregate_order_by: {
    count: { __type: "order_by" };
    max: { __type: "users_max_order_by" };
    min: { __type: "users_min_order_by" };
  };
  users_arr_rel_insert_input: {
    data: { __type: "[users_insert_input!]!" };
    on_conflict: { __type: "users_on_conflict" };
  };
  users_bool_exp: {
    _and: { __type: "[users_bool_exp]" };
    _not: { __type: "users_bool_exp" };
    _or: { __type: "[users_bool_exp]" };
    id: { __type: "uuid_comparison_exp" };
    name: { __type: "String_comparison_exp" };
    rocket: { __type: "String_comparison_exp" };
    timestamp: { __type: "timestamptz_comparison_exp" };
    twitter: { __type: "String_comparison_exp" };
  };
  users_insert_input: {
    id: { __type: "uuid" };
    name: { __type: "String" };
    rocket: { __type: "String" };
    timestamp: { __type: "timestamptz" };
    twitter: { __type: "String" };
  };
  users_max_fields: {
    __typename: { __type: "String!" };
    name: { __type: "String" };
    rocket: { __type: "String" };
    timestamp: { __type: "timestamptz" };
    twitter: { __type: "String" };
  };
  users_max_order_by: {
    name: { __type: "order_by" };
    rocket: { __type: "order_by" };
    timestamp: { __type: "order_by" };
    twitter: { __type: "order_by" };
  };
  users_min_fields: {
    __typename: { __type: "String!" };
    name: { __type: "String" };
    rocket: { __type: "String" };
    timestamp: { __type: "timestamptz" };
    twitter: { __type: "String" };
  };
  users_min_order_by: {
    name: { __type: "order_by" };
    rocket: { __type: "order_by" };
    timestamp: { __type: "order_by" };
    twitter: { __type: "order_by" };
  };
  users_mutation_response: {
    __typename: { __type: "String!" };
    affected_rows: { __type: "Int!" };
    returning: { __type: "[users!]!" };
  };
  users_obj_rel_insert_input: {
    data: { __type: "users_insert_input!" };
    on_conflict: { __type: "users_on_conflict" };
  };
  users_on_conflict: {
    constraint: { __type: "users_constraint!" };
    update_columns: { __type: "[users_update_column!]!" };
  };
  users_order_by: {
    id: { __type: "order_by" };
    name: { __type: "order_by" };
    rocket: { __type: "order_by" };
    timestamp: { __type: "order_by" };
    twitter: { __type: "order_by" };
  };
  users_set_input: {
    id: { __type: "uuid" };
    name: { __type: "String" };
    rocket: { __type: "String" };
    timestamp: { __type: "timestamptz" };
    twitter: { __type: "String" };
  };
  uuid_comparison_exp: {
    _eq: { __type: "uuid" };
    _gt: { __type: "uuid" };
    _gte: { __type: "uuid" };
    _in: { __type: "[uuid!]" };
    _is_null: { __type: "Boolean" };
    _lt: { __type: "uuid" };
    _lte: { __type: "uuid" };
    _neq: { __type: "uuid" };
    _nin: { __type: "[uuid!]" };
  };
};

export interface Address {
  __typename?: "Address";
  address?: Maybe<Scalars["String"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
}

export interface Capsule {
  __typename?: "Capsule";
  /**
   * @deprecated This is not available in the REST API after MongoDB has been deprecated
   */
  dragon?: Maybe<Dragon>;
  id?: Maybe<Scalars["ID"]["output"]>;
  landings?: Maybe<Scalars["Int"]["output"]>;
  missions?: Maybe<Array<Maybe<CapsuleMission>>>;
  original_launch?: Maybe<Scalars["Date"]["output"]>;
  reuse_count?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
}

export interface CapsuleMission {
  __typename?: "CapsuleMission";
  flight?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface Core {
  __typename?: "Core";
  asds_attempts?: Maybe<Scalars["Int"]["output"]>;
  asds_landings?: Maybe<Scalars["Int"]["output"]>;
  block?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  missions?: Maybe<Array<Maybe<CapsuleMission>>>;
  original_launch?: Maybe<Scalars["Date"]["output"]>;
  reuse_count?: Maybe<Scalars["Int"]["output"]>;
  rtls_attempts?: Maybe<Scalars["Int"]["output"]>;
  rtls_landings?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  water_landing?: Maybe<Scalars["Boolean"]["output"]>;
}

export interface CoreMission {
  __typename?: "CoreMission";
  flight?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface Distance {
  __typename?: "Distance";
  feet?: Maybe<Scalars["Float"]["output"]>;
  meters?: Maybe<Scalars["Float"]["output"]>;
}

export interface Dragon {
  __typename?: "Dragon";
  active?: Maybe<Scalars["Boolean"]["output"]>;
  crew_capacity?: Maybe<Scalars["Int"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  diameter?: Maybe<Distance>;
  dry_mass_kg?: Maybe<Scalars["Int"]["output"]>;
  dry_mass_lb?: Maybe<Scalars["Int"]["output"]>;
  first_flight?: Maybe<Scalars["String"]["output"]>;
  heat_shield?: Maybe<DragonHeatShield>;
  height_w_trunk?: Maybe<Distance>;
  id?: Maybe<Scalars["ID"]["output"]>;
  launch_payload_mass?: Maybe<Mass>;
  launch_payload_vol?: Maybe<Volume>;
  name?: Maybe<Scalars["String"]["output"]>;
  orbit_duration_yr?: Maybe<Scalars["Int"]["output"]>;
  pressurized_capsule?: Maybe<DragonPressurizedCapsule>;
  return_payload_mass?: Maybe<Mass>;
  return_payload_vol?: Maybe<Volume>;
  sidewall_angle_deg?: Maybe<Scalars["Float"]["output"]>;
  thrusters?: Maybe<Array<Maybe<DragonThrust>>>;
  trunk?: Maybe<DragonTrunk>;
  type?: Maybe<Scalars["String"]["output"]>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface DragonHeatShield {
  __typename?: "DragonHeatShield";
  dev_partner?: Maybe<Scalars["String"]["output"]>;
  material?: Maybe<Scalars["String"]["output"]>;
  size_meters?: Maybe<Scalars["Float"]["output"]>;
  temp_degrees?: Maybe<Scalars["Int"]["output"]>;
}

export interface DragonPressurizedCapsule {
  __typename?: "DragonPressurizedCapsule";
  payload_volume?: Maybe<Volume>;
}

export interface DragonThrust {
  __typename?: "DragonThrust";
  amount?: Maybe<Scalars["Int"]["output"]>;
  fuel_1?: Maybe<Scalars["String"]["output"]>;
  fuel_2?: Maybe<Scalars["String"]["output"]>;
  pods?: Maybe<Scalars["Int"]["output"]>;
  thrust?: Maybe<Force>;
  type?: Maybe<Scalars["String"]["output"]>;
}

export interface DragonTrunk {
  __typename?: "DragonTrunk";
  cargo?: Maybe<DragonTrunkCargo>;
  trunk_volume?: Maybe<Volume>;
}

export interface DragonTrunkCargo {
  __typename?: "DragonTrunkCargo";
  solar_array?: Maybe<Scalars["Int"]["output"]>;
  unpressurized_cargo?: Maybe<Scalars["Boolean"]["output"]>;
}

export interface Force {
  __typename?: "Force";
  kN?: Maybe<Scalars["Float"]["output"]>;
  lbf?: Maybe<Scalars["Float"]["output"]>;
}

export interface HistoriesResult {
  __typename?: "HistoriesResult";
  data?: Maybe<Array<Maybe<History>>>;
  result?: Maybe<Result>;
}

export interface History {
  __typename?: "History";
  details?: Maybe<Scalars["String"]["output"]>;
  event_date_unix?: Maybe<Scalars["Date"]["output"]>;
  event_date_utc?: Maybe<Scalars["Date"]["output"]>;
  flight?: Maybe<Launch>;
  id?: Maybe<Scalars["ID"]["output"]>;
  links?: Maybe<Link>;
  title?: Maybe<Scalars["String"]["output"]>;
}

export interface Info {
  __typename?: "Info";
  ceo?: Maybe<Scalars["String"]["output"]>;
  coo?: Maybe<Scalars["String"]["output"]>;
  cto?: Maybe<Scalars["String"]["output"]>;
  cto_propulsion?: Maybe<Scalars["String"]["output"]>;
  employees?: Maybe<Scalars["Int"]["output"]>;
  founded?: Maybe<Scalars["Int"]["output"]>;
  founder?: Maybe<Scalars["String"]["output"]>;
  headquarters?: Maybe<Address>;
  launch_sites?: Maybe<Scalars["Int"]["output"]>;
  links?: Maybe<InfoLinks>;
  name?: Maybe<Scalars["String"]["output"]>;
  summary?: Maybe<Scalars["String"]["output"]>;
  test_sites?: Maybe<Scalars["Int"]["output"]>;
  valuation?: Maybe<Scalars["Float"]["output"]>;
  vehicles?: Maybe<Scalars["Int"]["output"]>;
}

export interface InfoLinks {
  __typename?: "InfoLinks";
  elon_twitter?: Maybe<Scalars["String"]["output"]>;
  flickr?: Maybe<Scalars["String"]["output"]>;
  twitter?: Maybe<Scalars["String"]["output"]>;
  website?: Maybe<Scalars["String"]["output"]>;
}

export interface Landpad {
  __typename?: "Landpad";
  attempted_landings?: Maybe<Scalars["String"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  full_name?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  landing_type?: Maybe<Scalars["String"]["output"]>;
  location?: Maybe<Location>;
  status?: Maybe<Scalars["String"]["output"]>;
  successful_landings?: Maybe<Scalars["String"]["output"]>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface Launch {
  __typename?: "Launch";
  details?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  is_tentative?: Maybe<Scalars["Boolean"]["output"]>;
  launch_date_local?: Maybe<Scalars["Date"]["output"]>;
  launch_date_unix?: Maybe<Scalars["Date"]["output"]>;
  launch_date_utc?: Maybe<Scalars["Date"]["output"]>;
  launch_site?: Maybe<LaunchSite>;
  launch_success?: Maybe<Scalars["Boolean"]["output"]>;
  launch_year?: Maybe<Scalars["String"]["output"]>;
  links?: Maybe<LaunchLinks>;
  mission_id?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  mission_name?: Maybe<Scalars["String"]["output"]>;
  rocket?: Maybe<LaunchRocket>;
  ships?: Maybe<Array<Maybe<Ship>>>;
  static_fire_date_unix?: Maybe<Scalars["Date"]["output"]>;
  static_fire_date_utc?: Maybe<Scalars["Date"]["output"]>;
  telemetry?: Maybe<LaunchTelemetry>;
  tentative_max_precision?: Maybe<Scalars["String"]["output"]>;
  upcoming?: Maybe<Scalars["Boolean"]["output"]>;
}

export interface LaunchLinks {
  __typename?: "LaunchLinks";
  article_link?: Maybe<Scalars["String"]["output"]>;
  flickr_images?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  mission_patch?: Maybe<Scalars["String"]["output"]>;
  mission_patch_small?: Maybe<Scalars["String"]["output"]>;
  presskit?: Maybe<Scalars["String"]["output"]>;
  reddit_campaign?: Maybe<Scalars["String"]["output"]>;
  reddit_launch?: Maybe<Scalars["String"]["output"]>;
  reddit_media?: Maybe<Scalars["String"]["output"]>;
  reddit_recovery?: Maybe<Scalars["String"]["output"]>;
  video_link?: Maybe<Scalars["String"]["output"]>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface LaunchRocket {
  __typename?: "LaunchRocket";
  fairings?: Maybe<LaunchRocketFairings>;
  first_stage?: Maybe<LaunchRocketFirstStage>;
  rocket?: Maybe<Rocket>;
  rocket_name?: Maybe<Scalars["String"]["output"]>;
  rocket_type?: Maybe<Scalars["String"]["output"]>;
  second_stage?: Maybe<LaunchRocketSecondStage>;
}

export interface LaunchRocketFairings {
  __typename?: "LaunchRocketFairings";
  recovered?: Maybe<Scalars["Boolean"]["output"]>;
  recovery_attempt?: Maybe<Scalars["Boolean"]["output"]>;
  reused?: Maybe<Scalars["Boolean"]["output"]>;
  ship?: Maybe<Scalars["String"]["output"]>;
}

export interface LaunchRocketFirstStage {
  __typename?: "LaunchRocketFirstStage";
  cores?: Maybe<Array<Maybe<LaunchRocketFirstStageCore>>>;
}

export interface LaunchRocketFirstStageCore {
  __typename?: "LaunchRocketFirstStageCore";
  block?: Maybe<Scalars["Int"]["output"]>;
  core?: Maybe<Core>;
  flight?: Maybe<Scalars["Int"]["output"]>;
  gridfins?: Maybe<Scalars["Boolean"]["output"]>;
  land_success?: Maybe<Scalars["Boolean"]["output"]>;
  landing_intent?: Maybe<Scalars["Boolean"]["output"]>;
  landing_type?: Maybe<Scalars["String"]["output"]>;
  landing_vehicle?: Maybe<Scalars["String"]["output"]>;
  legs?: Maybe<Scalars["Boolean"]["output"]>;
  reused?: Maybe<Scalars["Boolean"]["output"]>;
}

export interface LaunchRocketSecondStage {
  __typename?: "LaunchRocketSecondStage";
  block?: Maybe<Scalars["Int"]["output"]>;
  payloads?: Maybe<Array<Maybe<Payload>>>;
}

export interface LaunchSite {
  __typename?: "LaunchSite";
  site_id?: Maybe<Scalars["String"]["output"]>;
  site_name?: Maybe<Scalars["String"]["output"]>;
  site_name_long?: Maybe<Scalars["String"]["output"]>;
}

export interface LaunchTelemetry {
  __typename?: "LaunchTelemetry";
  flight_club?: Maybe<Scalars["String"]["output"]>;
}

export interface LaunchesPastResult {
  __typename?: "LaunchesPastResult";
  data?: Maybe<Array<Maybe<Launch>>>;
  result?: Maybe<Result>;
}

export interface Launchpad {
  __typename?: "Launchpad";
  attempted_launches?: Maybe<Scalars["Int"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  location?: Maybe<Location>;
  name?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  successful_launches?: Maybe<Scalars["Int"]["output"]>;
  vehicles_launched?: Maybe<Array<Maybe<Rocket>>>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface Link {
  __typename?: "Link";
  article?: Maybe<Scalars["String"]["output"]>;
  reddit?: Maybe<Scalars["String"]["output"]>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface Location {
  __typename?: "Location";
  latitude?: Maybe<Scalars["Float"]["output"]>;
  longitude?: Maybe<Scalars["Float"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  region?: Maybe<Scalars["String"]["output"]>;
}

export interface Mass {
  __typename?: "Mass";
  kg?: Maybe<Scalars["Int"]["output"]>;
  lb?: Maybe<Scalars["Int"]["output"]>;
}

export interface Mission {
  __typename?: "Mission";
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  manufacturers?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  name?: Maybe<Scalars["String"]["output"]>;
  payloads?: Maybe<Array<Maybe<Payload>>>;
  twitter?: Maybe<Scalars["String"]["output"]>;
  website?: Maybe<Scalars["String"]["output"]>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface MissionResult {
  __typename?: "MissionResult";
  data?: Maybe<Array<Maybe<Mission>>>;
  result?: Maybe<Result>;
}

export interface Payload {
  __typename?: "Payload";
  customers?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  id?: Maybe<Scalars["ID"]["output"]>;
  manufacturer?: Maybe<Scalars["String"]["output"]>;
  nationality?: Maybe<Scalars["String"]["output"]>;
  norad_id?: Maybe<Array<Maybe<Scalars["Int"]["output"]>>>;
  orbit?: Maybe<Scalars["String"]["output"]>;
  orbit_params?: Maybe<PayloadOrbitParams>;
  payload_mass_kg?: Maybe<Scalars["Float"]["output"]>;
  payload_mass_lbs?: Maybe<Scalars["Float"]["output"]>;
  payload_type?: Maybe<Scalars["String"]["output"]>;
  reused?: Maybe<Scalars["Boolean"]["output"]>;
}

export interface PayloadOrbitParams {
  __typename?: "PayloadOrbitParams";
  apoapsis_km?: Maybe<Scalars["Float"]["output"]>;
  arg_of_pericenter?: Maybe<Scalars["Float"]["output"]>;
  eccentricity?: Maybe<Scalars["Float"]["output"]>;
  epoch?: Maybe<Scalars["Date"]["output"]>;
  inclination_deg?: Maybe<Scalars["Float"]["output"]>;
  lifespan_years?: Maybe<Scalars["Float"]["output"]>;
  longitude?: Maybe<Scalars["Float"]["output"]>;
  mean_anomaly?: Maybe<Scalars["Float"]["output"]>;
  mean_motion?: Maybe<Scalars["Float"]["output"]>;
  periapsis_km?: Maybe<Scalars["Float"]["output"]>;
  period_min?: Maybe<Scalars["Float"]["output"]>;
  raan?: Maybe<Scalars["Float"]["output"]>;
  reference_system?: Maybe<Scalars["String"]["output"]>;
  regime?: Maybe<Scalars["String"]["output"]>;
  semi_major_axis_km?: Maybe<Scalars["Float"]["output"]>;
}

export interface Result {
  __typename?: "Result";
  totalCount?: Maybe<Scalars["Int"]["output"]>;
}

export interface Roadster {
  __typename?: "Roadster";
  apoapsis_au?: Maybe<Scalars["Float"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  earth_distance_km?: Maybe<Scalars["Float"]["output"]>;
  earth_distance_mi?: Maybe<Scalars["Float"]["output"]>;
  eccentricity?: Maybe<Scalars["Float"]["output"]>;
  epoch_jd?: Maybe<Scalars["Float"]["output"]>;
  inclination?: Maybe<Scalars["Float"]["output"]>;
  launch_date_unix?: Maybe<Scalars["Date"]["output"]>;
  launch_date_utc?: Maybe<Scalars["Date"]["output"]>;
  launch_mass_kg?: Maybe<Scalars["Int"]["output"]>;
  launch_mass_lbs?: Maybe<Scalars["Int"]["output"]>;
  longitude?: Maybe<Scalars["Float"]["output"]>;
  mars_distance_km?: Maybe<Scalars["Float"]["output"]>;
  mars_distance_mi?: Maybe<Scalars["Float"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  norad_id?: Maybe<Scalars["Int"]["output"]>;
  orbit_type?: Maybe<Scalars["Float"]["output"]>;
  periapsis_arg?: Maybe<Scalars["Float"]["output"]>;
  periapsis_au?: Maybe<Scalars["Float"]["output"]>;
  period_days?: Maybe<Scalars["Float"]["output"]>;
  semi_major_axis_au?: Maybe<Scalars["Float"]["output"]>;
  speed_kph?: Maybe<Scalars["Float"]["output"]>;
  speed_mph?: Maybe<Scalars["Float"]["output"]>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface Rocket {
  __typename?: "Rocket";
  active?: Maybe<Scalars["Boolean"]["output"]>;
  boosters?: Maybe<Scalars["Int"]["output"]>;
  company?: Maybe<Scalars["String"]["output"]>;
  cost_per_launch?: Maybe<Scalars["Int"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  diameter?: Maybe<Distance>;
  engines?: Maybe<RocketEngines>;
  first_flight?: Maybe<Scalars["Date"]["output"]>;
  first_stage?: Maybe<RocketFirstStage>;
  height?: Maybe<Distance>;
  id?: Maybe<Scalars["ID"]["output"]>;
  landing_legs?: Maybe<RocketLandingLegs>;
  mass?: Maybe<Mass>;
  name?: Maybe<Scalars["String"]["output"]>;
  payload_weights?: Maybe<Array<Maybe<RocketPayloadWeight>>>;
  second_stage?: Maybe<RocketSecondStage>;
  stages?: Maybe<Scalars["Int"]["output"]>;
  success_rate_pct?: Maybe<Scalars["Int"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  wikipedia?: Maybe<Scalars["String"]["output"]>;
}

export interface RocketEngines {
  __typename?: "RocketEngines";
  engine_loss_max?: Maybe<Scalars["String"]["output"]>;
  layout?: Maybe<Scalars["String"]["output"]>;
  number?: Maybe<Scalars["Int"]["output"]>;
  propellant_1?: Maybe<Scalars["String"]["output"]>;
  propellant_2?: Maybe<Scalars["String"]["output"]>;
  thrust_sea_level?: Maybe<Force>;
  thrust_to_weight?: Maybe<Scalars["Float"]["output"]>;
  thrust_vacuum?: Maybe<Force>;
  type?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["String"]["output"]>;
}

export interface RocketFirstStage {
  __typename?: "RocketFirstStage";
  burn_time_sec?: Maybe<Scalars["Int"]["output"]>;
  engines?: Maybe<Scalars["Int"]["output"]>;
  fuel_amount_tons?: Maybe<Scalars["Float"]["output"]>;
  reusable?: Maybe<Scalars["Boolean"]["output"]>;
  thrust_sea_level?: Maybe<Force>;
  thrust_vacuum?: Maybe<Force>;
}

export interface RocketLandingLegs {
  __typename?: "RocketLandingLegs";
  material?: Maybe<Scalars["String"]["output"]>;
  number?: Maybe<Scalars["Int"]["output"]>;
}

export interface RocketPayloadWeight {
  __typename?: "RocketPayloadWeight";
  id?: Maybe<Scalars["String"]["output"]>;
  kg?: Maybe<Scalars["Int"]["output"]>;
  lb?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface RocketSecondStage {
  __typename?: "RocketSecondStage";
  burn_time_sec?: Maybe<Scalars["Int"]["output"]>;
  engines?: Maybe<Scalars["Int"]["output"]>;
  fuel_amount_tons?: Maybe<Scalars["Float"]["output"]>;
  payloads?: Maybe<RocketSecondStagePayloads>;
  thrust?: Maybe<Force>;
}

export interface RocketSecondStagePayloadCompositeFairing {
  __typename?: "RocketSecondStagePayloadCompositeFairing";
  diameter?: Maybe<Distance>;
  height?: Maybe<Distance>;
}

export interface RocketSecondStagePayloads {
  __typename?: "RocketSecondStagePayloads";
  composite_fairing?: Maybe<RocketSecondStagePayloadCompositeFairing>;
  option_1?: Maybe<Scalars["String"]["output"]>;
}

export interface RocketsResult {
  __typename?: "RocketsResult";
  data?: Maybe<Array<Maybe<Rocket>>>;
  result?: Maybe<Result>;
}

export interface Ship {
  __typename?: "Ship";
  abs?: Maybe<Scalars["Int"]["output"]>;
  active?: Maybe<Scalars["Boolean"]["output"]>;
  attempted_landings?: Maybe<Scalars["Int"]["output"]>;
  class?: Maybe<Scalars["Int"]["output"]>;
  course_deg?: Maybe<Scalars["Int"]["output"]>;
  home_port?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  image?: Maybe<Scalars["String"]["output"]>;
  imo?: Maybe<Scalars["Int"]["output"]>;
  missions?: Maybe<Array<Maybe<ShipMission>>>;
  mmsi?: Maybe<Scalars["Int"]["output"]>;
  model?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  position?: Maybe<ShipLocation>;
  roles?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  speed_kn?: Maybe<Scalars["Float"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  successful_landings?: Maybe<Scalars["Int"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
  weight_kg?: Maybe<Scalars["Int"]["output"]>;
  weight_lbs?: Maybe<Scalars["Int"]["output"]>;
  year_built?: Maybe<Scalars["Int"]["output"]>;
}

export interface ShipLocation {
  __typename?: "ShipLocation";
  latitude?: Maybe<Scalars["Float"]["output"]>;
  longitude?: Maybe<Scalars["Float"]["output"]>;
}

export interface ShipMission {
  __typename?: "ShipMission";
  flight?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface ShipsResult {
  __typename?: "ShipsResult";
  data?: Maybe<Array<Maybe<Ship>>>;
  result?: Maybe<Result>;
}

export interface Volume {
  __typename?: "Volume";
  cubic_feet?: Maybe<Scalars["Int"]["output"]>;
  cubic_meters?: Maybe<Scalars["Int"]["output"]>;
}

export interface _Service {
  __typename?: "_Service";
  sdl?: Maybe<Scalars["String"]["output"]>;
}

export interface Mutation {
  __typename?: "Mutation";
  /**
   * delete data from the table: "users"
   */
  delete_users: (args: {
    /**
     * filter the rows which have to be deleted
     */
    where: users_bool_exp;
  }) => Maybe<users_mutation_response>;
  /**
   * insert data into the table: "users"
   */
  insert_users: (args: {
    /**
     * the rows to be inserted
     */
    objects: Array<users_insert_input>;
    /**
     * on conflict condition
     */
    on_conflict?: Maybe<users_on_conflict>;
  }) => Maybe<users_mutation_response>;
  /**
   * update data of the table: "users"
   */
  update_users: (args: {
    /**
     * sets the columns of the filtered rows to the given values
     */
    _set?: Maybe<users_set_input>;
    /**
     * filter the rows which have to be updated
     */
    where: users_bool_exp;
  }) => Maybe<users_mutation_response>;
}

export interface Query {
  __typename?: "Query";
  _service: _Service;
  capsule: (args: { id: Scalars["ID"]["input"] }) => Maybe<Capsule>;
  capsules: (args?: {
    find?: Maybe<CapsulesFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Capsule>>>;
  capsulesPast: (args?: {
    find?: Maybe<CapsulesFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Capsule>>>;
  capsulesUpcoming: (args?: {
    find?: Maybe<CapsulesFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Capsule>>>;
  company?: Maybe<Info>;
  core: (args: { id: Scalars["ID"]["input"] }) => Maybe<Core>;
  cores: (args?: {
    find?: Maybe<CoresFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Core>>>;
  coresPast: (args?: {
    find?: Maybe<CoresFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Core>>>;
  coresUpcoming: (args?: {
    find?: Maybe<CoresFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Core>>>;
  dragon: (args: { id: Scalars["ID"]["input"] }) => Maybe<Dragon>;
  dragons: (args?: {
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Array<Maybe<Dragon>>>;
  histories: (args?: {
    find?: Maybe<HistoryFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<History>>>;
  historiesResult: (args?: {
    find?: Maybe<HistoryFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<HistoriesResult>;
  history: (args: { id: Scalars["ID"]["input"] }) => Maybe<History>;
  landpad: (args: { id: Scalars["ID"]["input"] }) => Maybe<Landpad>;
  landpads: (args?: {
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Array<Maybe<Landpad>>>;
  launch: (args: { id: Scalars["ID"]["input"] }) => Maybe<Launch>;
  launchLatest: (args?: {
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Launch>;
  launchNext: (args?: {
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Launch>;
  launches: (args?: {
    find?: Maybe<LaunchFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Launch>>>;
  launchesPast: (args?: {
    find?: Maybe<LaunchFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Launch>>>;
  launchesPastResult: (args?: {
    find?: Maybe<LaunchFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<LaunchesPastResult>;
  launchesUpcoming: (args?: {
    find?: Maybe<LaunchFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Launch>>>;
  launchpad: (args: { id: Scalars["ID"]["input"] }) => Maybe<Launchpad>;
  launchpads: (args?: {
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Array<Maybe<Launchpad>>>;
  /**
   * @deprecated Mission is not available on REST API after MongoDB deprecation
   */
  mission: (args: { id: Scalars["ID"]["input"] }) => Maybe<Mission>;
  /**
   * @deprecated Mission is not available on REST API after MongoDB deprecation
   */
  missions: (args?: {
    find?: Maybe<MissionsFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Array<Maybe<Mission>>>;
  /**
   * @deprecated Mission is not available on REST API after MongoDB deprecation
   */
  missionsResult: (args?: {
    find?: Maybe<MissionsFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<MissionResult>;
  payload: (args: { id: Scalars["ID"]["input"] }) => Maybe<Payload>;
  payloads: (args?: {
    find?: Maybe<PayloadsFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Payload>>>;
  roadster?: Maybe<Roadster>;
  rocket: (args: { id: Scalars["ID"]["input"] }) => Maybe<Rocket>;
  rockets: (args?: {
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<Array<Maybe<Rocket>>>;
  rocketsResult: (args?: {
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
  }) => Maybe<RocketsResult>;
  ship: (args: { id: Scalars["ID"]["input"] }) => Maybe<Ship>;
  ships: (args?: {
    find?: Maybe<ShipsFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<Array<Maybe<Ship>>>;
  shipsResult: (args?: {
    find?: Maybe<ShipsFind>;
    limit?: Maybe<Scalars["Int"]["input"]>;
    offset?: Maybe<Scalars["Int"]["input"]>;
    order?: Maybe<Scalars["String"]["input"]>;
    sort?: Maybe<Scalars["String"]["input"]>;
  }) => Maybe<ShipsResult>;
  /**
   * fetch data from the table: "users"
   */
  users: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the nuber of rows returned
     */
    limit?: Maybe<Scalars["Int"]["input"]>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars["Int"]["input"]>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => Array<users>;
  /**
   * fetch aggregated fields from the table: "users"
   */
  users_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the nuber of rows returned
     */
    limit?: Maybe<Scalars["Int"]["input"]>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars["Int"]["input"]>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => users_aggregate;
  /**
   * fetch data from the table: "users" using primary key columns
   */
  users_by_pk: (args: { id: Scalars["uuid"]["input"] }) => Maybe<users>;
}

export interface Subscription {
  __typename?: "Subscription";
  /**
   * fetch data from the table: "users"
   */
  users: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the nuber of rows returned
     */
    limit?: Maybe<Scalars["Int"]["input"]>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars["Int"]["input"]>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => Array<users>;
  /**
   * fetch aggregated fields from the table: "users"
   */
  users_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the nuber of rows returned
     */
    limit?: Maybe<Scalars["Int"]["input"]>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars["Int"]["input"]>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => users_aggregate;
  /**
   * fetch data from the table: "users" using primary key columns
   */
  users_by_pk: (args: { id: Scalars["uuid"]["input"] }) => Maybe<users>;
}

/**
 * columns and relationships of "users"
 */
export interface users {
  __typename?: "users";
  id?: Scalars["uuid"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  rocket?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Scalars["timestamptz"]["output"];
  twitter?: Maybe<Scalars["String"]["output"]>;
}

/**
 * aggregated selection of "users"
 */
export interface users_aggregate {
  __typename?: "users_aggregate";
  aggregate?: Maybe<users_aggregate_fields>;
  nodes: Array<users>;
}

/**
 * aggregate fields of "users"
 */
export interface users_aggregate_fields {
  __typename?: "users_aggregate_fields";
  count: (args?: {
    columns?: Maybe<Array<users_select_column>>;
    distinct?: Maybe<Scalars["Boolean"]["input"]>;
  }) => Maybe<Scalars["Int"]["output"]>;
  max?: Maybe<users_max_fields>;
  min?: Maybe<users_min_fields>;
}

/**
 * aggregate max on columns
 */
export interface users_max_fields {
  __typename?: "users_max_fields";
  name?: Maybe<Scalars["String"]["output"]>;
  rocket?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["timestamptz"]["output"]>;
  twitter?: Maybe<Scalars["String"]["output"]>;
}

/**
 * aggregate min on columns
 */
export interface users_min_fields {
  __typename?: "users_min_fields";
  name?: Maybe<Scalars["String"]["output"]>;
  rocket?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["timestamptz"]["output"]>;
  twitter?: Maybe<Scalars["String"]["output"]>;
}

/**
 * response of any mutation on the table "users"
 */
export interface users_mutation_response {
  __typename?: "users_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows?: Scalars["Int"]["output"];
  /**
   * data of the affected rows by the mutation
   */
  returning: Array<users>;
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}
