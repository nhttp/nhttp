/* @jsx h */
/* @jsxFrag Fragment */
import { Helmet } from "../../../lib/jsx.ts";
import {
  Fragment,
  FunctionComponent as FC,
  h,
} from "https://esm.sh/stable/preact@10.15.0";
import {
  useEffect,
  useState,
} from "https://esm.sh/stable/preact@10.15.0/hooks";
import withClient from "../helpers/client.ts";

const Counter: FC<{ init: number }> = ({ init }) => {
  const [count, setCount] = useState(init);

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <>
      <Helmet>
        <title>Counter</title>
      </Helmet>
      <button onClick={() => setCount((p) => p + 1)}>Increment</button>
      <button onClick={() => setCount((p) => p - 1)}>Decrement</button>
      <h1>{count}</h1>
    </>
  );
};

export default withClient(Counter, import.meta.url);
