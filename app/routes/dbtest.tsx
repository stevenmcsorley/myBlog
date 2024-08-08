import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MongoClient } from "mongodb";

export const loader = async () => {
  const client = new MongoClient(process.env.DATABASE_URL);
  let connectionStatus = "Failed";
  let collections = [];
  let error = null;

  try {
    await client.connect();
    connectionStatus = "Success";
    const db = client.db();
    collections = await db.listCollections().toArray();
    collections = collections.map((c) => c.name);
  } catch (e) {
    error = e.message;
  } finally {
    await client.close();
  }

  return json({
    connectionStatus,
    collections,
    error,
  });
};

export default function DBTest() {
  const { connectionStatus, collections, error } = useLoaderData();

  return (
    <div>
      <h1>Database Connection Test</h1>
      <p>Connection Status: {connectionStatus}</p>
      {error && <p>Error: {error}</p>}
      {collections.length > 0 && (
        <>
          <h2>Collections:</h2>
          <ul>
            {collections.map((collection, index) => (
              <li key={index}>{collection}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
