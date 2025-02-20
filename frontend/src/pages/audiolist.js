import Layout from "@/components/Layout";
import AudioList from "../components/AudioList";

export default function AudioPage() {
  return (
    <Layout>
    <div className="p-6">
      <AudioList />
    </div>
    </Layout>
  );
}
