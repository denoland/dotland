// This script demonstrates the runtime permission API.
// Run like this: `deno run https://deno.land/posts/v1.8/permission_api.ts`

function homedir() {
  try {
    console.log(`Your home dir is: ${Deno.env.get("HOME")}`);
  } catch (err) {
    console.log(`Failed to get the home directory: ${err}`);
  }
}

// Try to get the home directory (this should fail, as no env permission yet).
homedir();

console.log("Now requesting new privileges.");

const { state } = await Deno.permissions.request({ name: "env" });
if (state === "granted") {
  console.log(`You have granted the "env" permission.`);
} else {
  console.log(`You have not granted the "env" permission.`);
}

// Try to get the home directory (this should succeed if the user granted
// permissions above).
homedir();

await Deno.permissions.revoke({ name: "env" });
console.log("Privileges dropped.");

// Try to get the home directory (this should fail, as the permission was
// revoked).
homedir();
