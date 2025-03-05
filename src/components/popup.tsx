import { useState, useEffect } from "react";
import { ActionIcon, List, Text, Container, Title, Group, Card, Divider,Button } from "@mantine/core";
import { IconPin, IconPinned, IconTrash, IconRestore } from "@tabler/icons-react";
import "@mantine/core/styles.css";

const Popup = () => {
  const [sessions, setSessions] = useState<string[]>([]);
  const [pinnedSessions, setPinnedSessions] = useState<string[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const saveSession = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const urls = tabs.map((tab) => tab.url).filter(Boolean) as string[];
      const sessionName = prompt("Name this session:");
      if (sessionName) {
        chrome.storage.sync.set({ [sessionName]: urls }, () => {
          loadSessions();
        });
      }
    });
  };

  const restoreSession = (sessionName: string) => {
    chrome.storage.sync.get(sessionName, (data) => {
      const urls = data[sessionName];
      urls.forEach((url: string) => chrome.tabs.create({ url }));
    });
  };

  const deleteSession = (sessionName: string) => {
    chrome.storage.sync.remove(sessionName, () => {
      loadSessions();
    });
  };

  const pinSession = (sessionName: string) => {
    setPinnedSessions((prevPinnedSessions) => {
      if (prevPinnedSessions.includes(sessionName)) {
        return prevPinnedSessions.filter((session) => session !== sessionName);
      } else {
        return [sessionName, ...prevPinnedSessions];
      }
    });
  };

  const loadSessions = () => {
    chrome.storage.sync.get(null, (items) => {
      const allSessions = Object.keys(items);
      const pinned = allSessions.filter((session) => pinnedSessions.includes(session));
      const unpinned = allSessions.filter((session) => !pinnedSessions.includes(session));
      setPinnedSessions(pinned);
      setSessions(unpinned);
    });
  };

  const renderSession = (session: string, isPinned: boolean) => (
    <Card shadow="sm" p="sm" radius="md" withBorder style={{ marginBottom: 8 }}>
      <Group >
        <Group>
          <ActionIcon color={isPinned ? "yellow" : "gray"} onClick={() => pinSession(session)}>
            {isPinned ? <IconPinned size={18} /> : <IconPin size={18} />}
          </ActionIcon>
          <Text fw={500}>{session}</Text>
        </Group>
        <Group gap="xs">
          <ActionIcon color="green" onClick={() => restoreSession(session)}>
            <IconRestore size={18} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => deleteSession(session)}>
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );

  return (
    <Container p="lg" style={{ width: 320, borderRadius: 12, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", backgroundColor: "#f8f9fa" }}>
      <Title order={4} ta="center" mb="md" style={{ color: "#2c3e50" }}>
        🌐 Tab Whisperer
      </Title>
      <Button fullWidth color="teal" mb="sm" radius="md" onClick={saveSession}>
        Save Current Session
      </Button>
      <List spacing="sm" size="sm" center>
        {pinnedSessions.map((session) => renderSession(session, true))}
      </List>

      {pinnedSessions.length > 0 && <Divider my="md" />}

      <List spacing="sm" size="sm" center>
        {sessions.map((session) => renderSession(session, false))}
      </List>
    </Container>
  );
};

export default Popup;
