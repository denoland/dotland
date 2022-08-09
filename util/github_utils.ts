import {
  getRawFile,
  VersionMetaInfo,
} from "@/util/registry_utils.ts";

export function getGithubSponsorUsername(fileContent:string) {
    // get content who match with regex: github: [...]\n
    const regex = /github: \[(.*)\]\n/g;
    const match = regex.exec(fileContent);
    if(match){
      return match[1];
    }
    return "";
}


// Add the Github sponsors button to the top panel
export async function getGithubFirstSponsorIfPresent(name:string, version:string, versionMeta:VersionMetaInfo, path = "/.github/FUNDING.yml") {
  //check if the module contain file: .github/FUNDING.yml
  const check  = versionMeta.directoryListing.find((entry) => entry.path === "/.github/FUNDING.yml");
  if(check){
    console.log(name, version, path);
    const fileContent = (await getRawFile(name,version,path,path,versionMeta) as unknown as Record<string, string>);
    if(fileContent){
      const sponsor = getGithubSponsorUsername(fileContent.content)
      return sponsor
    }
  }
  return null;

}