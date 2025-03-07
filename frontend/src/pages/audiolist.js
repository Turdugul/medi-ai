import Layout from "@/components/Layout";
import AudioList from "../components/AudioList";

export default function AudioPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 ">
      <AudioList />
    </div>
    </Layout>
  );
}
