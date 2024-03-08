import ChatInterface from "@/components/Home/ChatInterface";
import ChatLayout from "@/components/Home/ChatLayout";
import VideoInterFace from "@/components/Home/VideoInterFace";
export default function Home() {
  return <>
    <ChatLayout>
      <ChatInterface />
      <VideoInterFace/>
    </ChatLayout>
  </>
}
