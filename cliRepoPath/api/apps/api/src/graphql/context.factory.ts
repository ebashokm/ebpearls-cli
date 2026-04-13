export type GqlContext = {
  req: any;
  res?: any;
};

export function createGqlContext({ req, res }: { req: any; res?: any }): GqlContext {
  return { req, res };
}
