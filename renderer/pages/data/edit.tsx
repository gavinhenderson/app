import React, { useState, useEffect, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Virtuoso } from "react-virtuoso";
import {
  getSubmittedSentences,
  deleteSubmittedSentence,
  ISentence,
} from "../../lib/api";

const CHUNK_SIZE = 10;

const SentenceRow = ({
  sentence,
  onDelete,
}: {
  sentence: ISentence;
  onDelete: (uuid: string) => void;
}) => (
  <Box>
    <div style={{ height: "1rem" }} />
    <Paper elevation={1}>
      <Box px={2}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={10}>
            <Typography variant="body1">{sentence.content}</Typography>
          </Grid>

          <Grid item xs="auto" style={{ marginLeft: "auto" }}>
            <IconButton
              aria-label="delete"
              color="secondary"
              onClick={() => onDelete(sentence.uuid)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
    <div style={{ height: "1rem" }} />
  </Box>
);

const loadedOffsets: number[] = [];

const EditData = () => {
  const [sentences, setSentences] = useState<ISentence[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    const offset = sentences.length;

    if (loadedOffsets.includes(offset)) {
      return;
    }

    loadedOffsets.push(offset);

    setIsLoading(true);
    const s = await getSubmittedSentences({ limit: CHUNK_SIZE, offset });

    setSentences((currentSentences) => [...currentSentences, ...s]);
    setIsLoading(false);
  }, [sentences]);

  const handleDelete = useCallback(async (uuid: string) => {
    await deleteSubmittedSentence(uuid);

    setSentences((currentSentences) =>
      currentSentences.filter((s) => s.uuid !== uuid)
    );
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h2">Edit uploaded data</Typography>
      </Grid>

      <Virtuoso
        style={{
          width: "100%",
          height: "90vh",
          marginLeft: "2rem",
          marginRight: "2rem",
        }}
        overscan={500}
        totalCount={sentences.length}
        item={(index) => (
          <SentenceRow sentence={sentences[index]} onDelete={handleDelete} />
        )}
        endReached={() => loadMore()}
        atBottomStateChange={(atBottom) => {
          if (atBottom) {
            loadMore();
          }
        }}
        footer={() =>
          isLoading ? <LinearProgress style={{ height: "1rem" }} /> : <div />
        }
      />
    </Grid>
  );
};

EditData.breadcrumb = {
  name: "back to dashboard",
  href: "/dashboard",
};

export default EditData;
