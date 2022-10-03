import { GreetingUtil } from "../utils/greeting";
import Layout from "../components/layout";

export async function getServerSideProps() {
  try {
    const grpc = new GreetingUtil();
    const greeting = await grpc.sendGreeting({
      name: "utku",
      age: 3,
      job: 0,
      fav_movies: ["yes", "no", "maybe"],
    });
    return {
      props: {
        greeting,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        greeting: "error",
      },
    };
  }
}

const Grpc = ({ greeting }) => {
  return (
    <Layout>
      <div>greeting:</div>
      {greeting}
    </Layout>
  );
};

export default Grpc;
