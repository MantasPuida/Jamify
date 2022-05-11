import * as React from "react";

interface Props {
  initialSeconds: number;
}

export const Timer = React.memo<Props>((props) => {
  // eslint-disable-next-line react/prop-types
  const { initialSeconds } = props;
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(initialSeconds);
  React.useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  if (seconds === 0 && minutes === 0) {
    return <>Delete</>;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{seconds}</>;
});
