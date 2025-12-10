import { resolve, query } from "./gqty";

async function main() {
  const launches = await resolve(({ query }) => {
    const pastLaunches = query.launchesPast({ limit: 5 });
    return pastLaunches?.map((launch) => ({
      id: launch?.id,
      mission_name: launch?.mission_name,
      launch_date_utc: launch?.launch_date_utc,
      launch_success: launch?.launch_success,
      rocket_name: launch?.rocket?.rocket_name,
      details: launch?.details,
    }));
  });

  console.log("SpaceX Past Launches:");
  console.log("=".repeat(50));

  launches?.forEach((launch, index) => {
    console.log(`\n${index + 1}. ${launch?.mission_name}`);
    console.log(`   ID: ${launch?.id}`);
    console.log(`   Date: ${launch?.launch_date_utc}`);
    console.log(`   Rocket: ${launch?.rocket_name}`);
    console.log(`   Success: ${launch?.launch_success}`);
    if (launch?.details) {
      console.log(`   Details: ${launch.details.substring(0, 100)}...`);
    }
  });

  console.log("\n" + "=".repeat(50));

  const company = await resolve(({ query }) => ({
    name: query.company?.name,
    ceo: query.company?.ceo,
    employees: query.company?.employees,
    founded: query.company?.founded,
    headquarters: {
      city: query.company?.headquarters?.city,
      state: query.company?.headquarters?.state,
    },
  }));

  console.log("\nSpaceX Company Info:");
  console.log(`Name: ${company.name}`);
  console.log(`CEO: ${company.ceo}`);
  console.log(`Employees: ${company.employees}`);
  console.log(`Founded: ${company.founded}`);
  console.log(`HQ: ${company.headquarters?.city}, ${company.headquarters?.state}`);
}

main().catch(console.error);
