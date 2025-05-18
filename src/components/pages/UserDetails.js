import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Icon,
  Segment,
  Label,
  Image,
  Header,
  List,
  Loader,
  Grid,
  Divider
} from "semantic-ui-react";

function UserDetails(props) {
  const [state, setState] = useState({
    profile: {},
    repository: [],
    loading: true,
    reposPerPage: 5,
    showAllRepos: false
  });

  useEffect(() => {
    const getUser = async (uid = props.match.params.uid) => {
      try {
        setState(prevState => ({ ...prevState, loading: true }));
        
        const profileResponse = await fetch(
          `https://api.github.com/users/${uid}`
        );
        const profile = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profile.message || 'Failed to fetch profile');
        }

        const repoResponse = await fetch(
          `https://api.github.com/users/${uid}/repos?sort=updated&direction=desc`
        );
        const repos = await repoResponse.json();

        if (!repoResponse.ok) {
          throw new Error(repos.message || 'Failed to fetch repositories');
        }

        setState(prevState => ({ 
          ...prevState,
          profile: profile, 
          repository: Array.isArray(repos) ? repos : [], 
          loading: false 
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setState(prevState => ({ 
          ...prevState,
          profile: {}, 
          repository: [], 
          loading: false 
        }));
      }
    };
    getUser();
    //eslint-disable-next-line
  }, []);

  const toggleRepos = () => {
    setState(prevState => ({
      ...prevState,
      showAllRepos: !prevState.showAllRepos
    }));
  };

  const displayedRepos = state.showAllRepos 
    ? state.repository 
    : state.repository.slice(0, state.reposPerPage);

  return (
    <React.Fragment>
      <Button as={Link} to="/" content="Back To Search" icon="arrow left" />

      <Segment.Group horizontal raised>
        <Segment
          textAlign="center"
          style={{ width: "40%" }}
          loading={state.loading}
        >
          <Image src={state.profile.avatar_url} size="medium" circular centered />
          <Header content={state.profile.name} size="large" style={{ marginTop: '1em' }} />
          <Header
            content={`Location: ${state.profile.location || 'Not specified'}`}
            size="small"
            style={{ marginTop: "0px" }}
          />
          {!!state.profile.hireable ? (
            <Label color="green" size="large">
              <Icon name="checkmark" />
              Hireable
            </Label>
          ) : (
            <Label color="red" size="large">
              <Icon name="close" /> Not Hireable
            </Label>
          )}
        </Segment>
        <Segment style={{ width: "60%" }} loading={state.loading}>
          <Header content="Bio" size="large" />
          <p style={{ fontSize: '1.1em' }}>{state.profile.bio || 'No bio available'}</p>

          <Button
            as="a"
            href={state.profile.html_url}
            target="_blank"
            content="Visit Github Profile"
            color="black"
            size="large"
            icon="github"
          />

          <Divider />
          <List size="large">
            <List.Item>
              <Icon name="user" />
              <List.Content>Username: {state.profile.login}</List.Content>
            </List.Item>
            <List.Item>
              <Icon name="building" />
              <List.Content>Company: {state.profile.company || 'Not specified'}</List.Content>
            </List.Item>
            <List.Item>
              <Icon name="linkify" />
              <List.Content>Website: {state.profile.blog || 'Not specified'}</List.Content>
            </List.Item>
          </List>
        </Segment>
      </Segment.Group>

      <Segment textAlign="center" style={{ marginTop: '1em' }}>
        <Label.Group size="large">
          <Label color="red">
            <Icon name="users" />
            Followers: {state.profile.followers}
          </Label>
          <Label color="green">
            <Icon name="user plus" />
            Following: {state.profile.following}
          </Label>
          <Label color="grey">
            <Icon name="github" />
            Public Repos: {state.profile.public_repos}
          </Label>
          <Label color="black">
            <Icon name="github alternate" />
            Public Gists: {state.profile.public_gists}
          </Label>
        </Label.Group>
      </Segment>

      <Segment.Group style={{ marginTop: '1em' }}>
        <Segment>
          <Header as="h2" content="Repositories" />
          <Loader active={state.loading} />
          <Grid>
            {displayedRepos.map((repo, i) => (
              <Grid.Row key={i}>
                <Grid.Column>
                  <Segment>
                    <Header as="h3">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                    </Header>
                    <p style={{ fontSize: '1.1em' }}>{repo.description || 'No description available'}</p>
                    <Label.Group size="large">
                      <Label color="blue">
                        <Icon name="star" />
                        Stars: {repo.stargazers_count}
                      </Label>
                      <Label color="green">
                        <Icon name="fork" />
                        Forks: {repo.forks_count}
                      </Label>
                      <Label color="grey">
                        <Icon name="eye" />
                        Watchers: {repo.watchers_count}
                      </Label>
                      {repo.language && (
                        <Label color="purple">
                          <Icon name="code" />
                          {repo.language}
                        </Label>
                      )}
                      {repo.license && (
                        <Label color="orange">
                          <Icon name="balance scale" />
                          {repo.license.name}
                        </Label>
                      )}
                    </Label.Group>
                    <div style={{ marginTop: '10px' }}>
                      <Label size="tiny">
                        <Icon name="calendar" />
                        Created: {new Date(repo.created_at).toLocaleDateString()}
                      </Label>
                      <Label size="tiny">
                        <Icon name="refresh" />
                        Updated: {new Date(repo.updated_at).toLocaleDateString()}
                      </Label>
                    </div>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
          {state.repository.length > state.reposPerPage && (
            <Button
              fluid
              onClick={toggleRepos}
              content={state.showAllRepos ? "Show Less" : "Show More"}
              icon={state.showAllRepos ? "chevron up" : "chevron down"}
              style={{ marginTop: '1em' }}
            />
          )}
        </Segment>
      </Segment.Group>
    </React.Fragment>
  );
}
export default UserDetails;
