import {
  CardWrapper,
  CardImage,
  CardTextWrapper,
  CardTextDate,
  CardTextTitle,
  CardTextBody,
  CardStatWrapper,
  CardStats,
  LinkText
} from "./CardStyles";

export const Card = ({ title, date, duration, imgUrl }) => {
  return (
    <CardWrapper>
    <CardImage background={imgUrl} />
    <CardTextWrapper>
        <CardTextDate>{date}</CardTextDate>
        <CardTextTitle>{title}</CardTextTitle>
        <CardTextBody>
            Played for {duration}
        </CardTextBody>
    </CardTextWrapper>
    <CardStatWrapper>
        {/* <CardStats>
        <div>
            1<sup>m</sup>
        </div>
        <div>read</div>
        </CardStats> */}
        <CardStats>
        <LinkText href="#">website</LinkText>
        </CardStats>
        <CardStats>
        <LinkText href="#">github</LinkText>
        </CardStats>
    </CardStatWrapper>
    </CardWrapper>
  );
};
