import { graphConfig } from "../../authConfig";

export async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers
  };

  var rolesResponse = await fetch("https://graph.microsoft.com/v1.0/servicePrincipals/f9eae6e8-4316-481b-8e06-526dfbb31e84/appRoleAssignedTo?$select=appRoleId,principalId", options)
  var roles = (await rolesResponse.json()).value.reduce((acc: any, curr: any) => {
    acc[curr.principalId] = curr.appRoleId;
    return acc;
  }, {});

  var userResponse = await fetch("https://graph.microsoft.com/v1.0/users", options)
  var users = (await userResponse.json()).value.filter((z: any) => roles[z.id] == "730e52c5-2c18-4a73-a690-c5d3307a4e84")

  return users;
}