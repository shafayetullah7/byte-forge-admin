export default function Health() {
  return <pre>{JSON.stringify({ status: "ok" })}</pre>;
}
