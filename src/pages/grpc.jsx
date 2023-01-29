import { GreetingUtil } from "../utils/greeting";
import Layout from "../components/layout";

export async function getServerSideProps() {
  try {
    const grpc = new GreetingUtil();
    const countryData = await grpc.sendGreeting({
      name: "utku",
      age: 3,
      job: 0,
      fav_movies: ["yes", "no", "maybe"],
    });
    return {
      props: {
        countryData: JSON.parse(countryData),
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        countryData: "error",
      },
    };
  }
}

const Grpc = ({ countryData }) => {
  if (countryData === "error") {
    return <span>Something went wrong:(</span>;
  }

  if (!countryData.length) {
    return <span>There is nothing here...</span>;
  }

  return (
    <Layout>
      <div>greeting:</div>
      {countryData.map((details) => (
        <div style={styles.card}>
          {Object.entries(details).map(([key, value]) => (
            <span style={styles.key}>
              {key}: {value}
            </span>
          ))}
        </div>
      ))}
    </Layout>
  );
};

const styles = {
  key: {
    display: "block",
  },
  card: {
    backgroundColor: "#666",
    color: "#FFF",
    padding: "1em",
    marginBottom: "1em",
    borderRadius: "1em",
  },
};

export default Grpc;
