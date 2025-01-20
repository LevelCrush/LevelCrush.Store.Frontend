/*import {
    reactExtension,
    Link,
    Card,
    InlineStack,
    Text,
    useApi,
  } from "@shopify/ui-extensions-react/customer-account";
  import {
    Badge,
    BlockLayout,
    Button,
    Form,
    Grid,
    Heading,
    HeadingGroup,
    List,
    View,
  } from "@shopify/ui-extensions-react/checkout";
  import { InlineLayout } from "@shopify/ui-extensions-react/checkout";
  import { useEffect, useState } from "react";
  import { BlockStack } from "@shopify/ui-extensions-react/checkout";
  import { MD5 } from "crypto-js";
  
  export default reactExtension("customer-account.profile.block.render", () => (
    <BlockExtension />
  ));
  
  interface Metadata {
    id: string;
    key: string;
    jsonValue: string | boolean | number;
  }
  
  interface MetadataVariables {
    gid: string;
  }
  
  interface MetadataQuery {
    customer: {
      discord_id?: { value: string };
      discord_name?: { value: string };
      discord_server_member?: { value: boolean };
      bungie_id?: { value: string };
      bungie_name?: { value: string };
      network_clan_member?: { value: boolean };
    };
  }
  
  interface BungieValidationResult {
    membershipId: string;
    membershipType: number;
    displayName: string;
    inNetworkClan: boolean;
  }
  
  interface DiscordValidationResult {
    discordHandle: string;
    discordId: string;
    inServer: boolean;
  }
  
  function BlockExtension() {
    const { i18n, query, authenticatedAccount, navigation } =
      useApi<"customer-account.profile.block.render">();
    const [loading, setLoading] = useState(false);
    const [discordId, setDiscordId] = useState("");
    const [bungieId, setBungieId] = useState("");
    const [discordName, setDiscordName] = useState("NOT LINKED");
    const [bungieName, setBungieName] = useState("NOT LINKED");
    const [bungiePlatform, setBungiePlatform] = useState(-1);
    const [discordValidated, setDiscordValidated] = useState(false);
    const [bungieValidated, setBungieValidated] = useState(false);
    const [inDiscord, setInDiscord] = useState(false);
    const [inClan, setInClan] = useState(false);
    const [xtoken, setXToken] = useState(
      MD5(`${authenticatedAccount.customer.current.id}||${Date.now()}`)
    );
  
    async function getLevelCrushMetadata() {
      if (loading) {
        return;
      }
      setLoading(true);
  
      try {
        const response = await fetch(
          "shopify:customer-account/api/2025-01/graphql.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `{
              customer {
                discord_id: metafield(namespace:"levelcrush", key:"discord_id") {  value: jsonValue } 
                discord_name: metafield(namespace: "levelcrush", key: "discord_handle") {  value: jsonValue }
                discord_server_member: metafield(namespace: "levelcrush", key: "server_member") {  value: jsonValue }
                bungie_id: metafield(namespace: "levelcrush", key: "bungie_id") {  value: jsonValue }
                bungie_name: metafield(namespace: "levelcrush", key:"bungie_name") {  value: jsonValue }
                bungie_platform: metafield(namespace: "levelcrush", key: "bungie_platform") {  value: jsonValue }
                network_clan_member: metafield(namespace: "levelcrush", key:"is_network_clan") { value: jsonValue }
              }
            }
          `,
              variables: {},
            }),
          }
        );
  
        const { data } = (await response.json()) as {
          data: MetadataQuery;
          extensions: any;
        };
  
        console.log("Metadata fetch", data);
  
        setDiscordId(data.customer.discord_id?.value || "");
        if (
          data.customer.discord_id &&
          data.customer.discord_id.value.trim().length > 0
        ) {
          setDiscordName(data.customer.discord_name?.value || "");
          setInDiscord(data.customer.discord_server_member?.value || false);
  
          // this is kinda hacky, but we can assume that the id came from our external service. So if its populate.d Lets just assume its valid for now.
          setDiscordValidated(data.customer.discord_id.value.length > 0);
        } else {
          setDiscordName("NOT LINKED");
          setInDiscord(false);
        }
  
        if (
          data.customer.bungie_id &&
          data.customer.bungie_id.value.trim().length > 0
        ) {
          setBungieId(data.customer.bungie_id.value || "");
          setBungieName(data.customer.bungie_name?.value || "");
  
          // this is kinda hacky, but we can assume that the id came from our external service. So if its populate.d Lets just assume its valid for now.
          setBungieValidated(data.customer.bungie_id.value.length > 0);
        } else {
          setBungieId("");
          setBungieName("NOT LINKED");
          setBungieValidated(false);
        }
  
        // technically this flag is applicable for any **networked** / **affiliated** level crush clan/guild/whatever
        // keep it seperate
        setInClan(data.customer.network_clan_member?.value || false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  
    async function updateMetadata(pairs: [string, string][]) {
      const gid = `gid://shopify/Customer/${authenticatedAccount.customer.current.id}`;
      const metafields = [] as Record<any, any>[];
  
      for (const [key, value] of pairs) {
        metafields.push({
          key,
          ownerId: gid,
          namespace: "levelcrush",
          value,
        });
      }
  
      await fetch("shopify:customer-account/api/2025-01/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation updateMetafields($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              userErrors {
                field
                message
              }
            }
          }`,
          variables: {
            metafields: metafields,
          },
        }),
      });
      console.log("Done removing metadata");
  
      console.log("Refetching metadata");
      await getLevelCrushMetadata();
      console.log("Done refetching metadata");
    }
  
    async function unlinkMetadata(keys: string[]) {
      const gid = `gid://shopify/Customer/${authenticatedAccount.customer.current.id}`;
      const metafields = [] as Record<any, any>[];
  
      for (const key of keys) {
        metafields.push({
          key,
          ownerId: gid,
          namespace: "levelcrush",
        });
      }
  
      await fetch("shopify:customer-account/api/2025-01/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation deleteMetafields($metafields: [MetafieldIdentifierInput!]!) {
            metafieldsDelete(metafields: $metafields) {
              userErrors {
                field
                message
              }
            }
          }`,
          variables: {
            metafields: metafields,
          },
        }),
      });
      console.log("Done removing metadata");
  
      console.log("Refetching metadata");
      await getLevelCrushMetadata();
      console.log("Done refetching metadata");
    }
  
    async function checkBungieClaim() {
      const sessReq = await fetch(
        "https://auth.levelcrush.com/platform/bungie/claim",
        {
          method: "POST",
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: xtoken.toString(),
          }),
        }
      );
  
      const data = (await sessReq.json()) as BungieValidationResult | null;
      return data && data.membershipId != null && data.membershipId.length > 0
        ? data
        : null;
    }
  
    async function checkDiscordClaim() {
      const sessReq = await fetch(
        "https://auth.levelcrush.com/platform/discord/claim",
        {
          method: "POST",
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: xtoken.toString(),
          }),
        }
      );
  
      const data = (await sessReq.json()) as DiscordValidationResult | null;
      return data && data.discordId != null && data.discordId.length > 0
        ? data
        : null;
    }
  
    // End Functions
  
    useEffect(() => {
      getLevelCrushMetadata();
    }, []);
  
    return (
      <Card padding>
        <BlockLayout rows={["auto", "fill"]} spacing={"base"}>
          <Heading level={1}>Link your account</Heading>
          <HeadingGroup>
            <Form
              onSubmit={() => {
                console.log("Submitted!");
              }}
            >
              <InlineLayout minInlineSize={300} spacing={"base"}>
                <BlockLayout
                  border="base"
                  padding={"base"}
                  rows={["auto", "auto", "auto"]}
                  spacing={"base"}
                >
                  <Heading>
                    <InlineLayout
                      columns={["fill", "auto", "auto"]}
                      spacing={"base"}
                    >
                      Discord
                      <Badge
                        icon={discordValidated ? "checkmark" : "close"}
                        tone={discordValidated ? "default" : "critical"}
                      >
                        {discordValidated ? "Linked" : "Not Linked"}
                      </Badge>
                      <Badge
                        icon={inDiscord ? "checkmark" : "close"}
                        tone={inDiscord ? "default" : "subdued"}
                      >
                        {inDiscord ? "Server Member" : "Not Server Member"}
                      </Badge>
                    </InlineLayout>
                  </Heading>
                  <Text>{discordName}</Text>
                  {discordId.length == 0 ? (
                    <Link
                      to={`https://auth.levelcrush.com/platform/discord/login?token=${xtoken}`}
                      external={true}
                      onPress={() => {
                        const attemptClaim = async () => {
                          var results = await checkDiscordClaim();
                          if (results && results.discordId.length > 0) {
                            await updateMetadata([
                              ["discord_id", `${results.discordId}`],
                              ["discord_handle", `${results.discordHandle}`],
                              [
                                "server_member",
                                `${results.inServer ? "true" : "false"}`,
                              ],
                            ]);
                            await getLevelCrushMetadata();
                          } else {
                            setTimeout(attemptClaim, 1000);
                          }
                        };
                        attemptClaim();
                      }}
                    >
                      Link
                    </Link>
                  ) : (
                    <Button
                      onPress={() => {
                        if (discordId.length > 0) {
                          console.log("Unlinking discord");
                          unlinkMetadata([
                            "discord_id",
                            "discord_handle",
                            "server_member",
                          ]);
                        } else {
                          console.log("Link action here");
                        }
                      }}
                    >
                      Unlink
                    </Button>
                  )}
                </BlockLayout>
                <BlockLayout
                  border="base"
                  padding={"base"}
                  rows={["auto", "auto", "auto"]}
                  spacing={"base"}
                >
                  <Heading>
                    <InlineLayout
                      columns={["fill", "auto", "auto"]}
                      spacing={"base"}
                    >
                      Bungie
                      <Badge
                        icon={bungieValidated ? "checkmark" : "close"}
                        tone={bungieValidated ? "default" : "critical"}
                      >
                        {bungieValidated ? "Linked" : "Not Linked"}
                      </Badge>
                      <Badge
                        icon={inClan ? "checkmark" : "close"}
                        tone={inClan ? "default" : "subdued"}
                      >
                        {inClan ? "Clan Member" : "Not Clan Member"}
                      </Badge>
                    </InlineLayout>
                  </Heading>
                  <Text>{bungieName}</Text>
                  {bungieId.length == 0 ? (
                    <Link
                      to={`https://auth.levelcrush.com/platform/bungie/login?token=${xtoken}`}
                      external={true}
                      onPress={() => {
                        const attemptClaim = async () => {
                          var results = await checkBungieClaim();
                          if (results && results.membershipId.length > 0) {
                            await updateMetadata([
                              ["bungie_id", `${results.membershipId}`],
                              ["bungie_name", `${results.displayName}`],
                              ["bungie_platform", `${results.membershipType}`],
                              [
                                "is_network_clan",
                                `${results.inNetworkClan ? "true" : "false"}`,
                              ],
                            ]);
                            await getLevelCrushMetadata();
                          } else {
                            setTimeout(attemptClaim, 1000);
                          }
                        };
  
                        attemptClaim();
                      }}
                    >
                      Link
                    </Link>
                  ) : (
                    <Button
                      onPress={() => {
                        unlinkMetadata([
                          "bungie_id",
                          "bungie_name",
                          "bungie_platform",
                          "is_network_clan",
                        ]);
                      }}
                    >
                      Unlink
                    </Button>
                  )}
                </BlockLayout>
              </InlineLayout>
            </Form>
          </HeadingGroup>
        </BlockLayout>
      </Card>
    );
  }
  */

import { Badge, Button } from "@medusajs/ui";
import { Check, Link, Trash, XMark } from "@medusajs/icons";
import { MetadataType, StoreCustomer } from "@medusajs/types";
import { retrieveCustomer } from "@lib/data/customer";
import { AccountLinkPlatform } from "./AccountLinkPlatform";
import { notFound } from "next/navigation";

export async function AccountLinkBook() {
  const customer = await retrieveCustomer();
  if (!customer) {
    notFound();
  }
  
  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap gap-2">
        <AccountLinkPlatform
          customer={customer}
          title="Discord"
          metakeyDisplayName="discord.handle"
          metakeyAccountID="discord.id"
          platform="discord"
          badges={[
            {
              name: "Validated",
              metakeyResult: "discord.id",
              tooltip_valid: "Your account has been validated",
              tooltip_invalid: "Link your account to validate",
            },
            {
              name: "Member",
              metakeyResult: "discord.server_member",
              tooltip_valid: "Your in the Level Crush Discord",
              tooltip_invalid: "You are not in the Level Crush Discord",
            },
          ]}
        />
        <AccountLinkPlatform
          customer={customer}
          title="Bungie"
          metakeyDisplayName="bungie.handle"
          metakeyAccountID="bungie.id"
          platform="bungie"
          badges={[
            {
              name: "Validated",
              metakeyResult: "bungie.id",
              tooltip_valid: "Your Bungie account has been validated",
              tooltip_invalid: "Link your bungie account to validate",
            },
            {
              name: "Clan",
              metakeyResult: "bungie.clan_member",
              tooltip_valid: "Your in an affiliated clan",
              tooltip_invalid: "You are not in an affiliated clan",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default AccountLinkBook;
