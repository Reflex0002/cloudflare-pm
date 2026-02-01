import {
  CreatedCell,
  PillCell,
  SentimentCell,
  SourceCell,
  TagsCell,
  TitleCell,
} from "./cellRenderers";

export const feedbackColumns = [
  {
    header: "Source",
    accessorKey: "sourceLabel",
    enableSorting: true,
    cell: (info) => <SourceCell item={info.row.original} />,
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: (info) => <TitleCell item={info.row.original} />,
  },
  {
    header: "Type",
    accessorKey: "type",
    enableSorting: false,
    cell: (info) => <PillCell value={info.getValue()} />,
  },
  {
    header: "Priority",
    accessorKey: "priority",
    enableSorting: true,
    cell: (info) => <PillCell value={info.getValue()} />,
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    cell: (info) => <PillCell value={info.getValue()} />,
  },
  {
    header: "Sentiment",
    accessorKey: "sentiment",
    enableSorting: false,
    cell: (info) => <SentimentCell value={info.getValue()} />,
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    enableSorting: true,
    cell: (info) => <CreatedCell value={info.getValue()} />,
  },
  {
    header: "Tags",
    accessorKey: "tags",
    enableSorting: false,
    cell: (info) => <TagsCell value={info.getValue()} />,
  },
];
