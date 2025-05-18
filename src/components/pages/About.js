import React from "react";
import { Segment, Header, Icon } from "semantic-ui-react";

function About() {
  return (
    <Segment>
      <Header as="h2" content="OmarElbakouri Github Finder" />
      <Header as="h4" content="React App" />
      <p><Icon name="code" /> Version: 1.0.0</p>
      <p><Icon name="user" /> Developed By: Omar Elbakouri</p>
      <p><Icon name="heart" /> Inspired From: Brad Traversy</p>
    </Segment>
  );
}

export default About;
