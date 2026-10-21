import { useEffect, useState } from "react";
import { Container } from "../../components";
import {
  Count,
  CounterCircle,
  CounterContainer,
  Heading,
  PageWrapper,
  TopHeading,
} from "./Connecting.styles";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import {
  selectCallType,
  selectMeetingUrl,
} from "../../store/features/members/membersSlice";

export default function Connecting() {
  const navigate = useNavigate();
  const callType = useAppSelector(selectCallType);
  const meetingUrl = useAppSelector(selectMeetingUrl);

  const [count, setCount] = useState<number>(10);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (meetingUrl) {
      window.location.replace(meetingUrl);
    } else {
      navigate("/");
    }
  }, [count, meetingUrl, navigate]);

  return (
    <Container hasPadding={true}>
      <PageWrapper>
        <CounterContainer>
          {callType === "family" && (
            <TopHeading>
              One of your friend/family will meet you soon
            </TopHeading>
          )}
          <Heading>
            {callType !== "family"
              ? "Connecting with Provider in .........."
              : "Connecting to the room. Please wait ....."}
          </Heading>
          <CounterCircle>
            <Count>{count}</Count>
          </CounterCircle>
        </CounterContainer>
      </PageWrapper>
    </Container>
  );
}
