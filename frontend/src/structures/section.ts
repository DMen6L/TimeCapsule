export type SectionType = "receiver" | "message" | "date";

export interface Section {
    key: SectionType;
    label: string;
}

export const sections: Section[] = [
    { key: "receiver", label: "Receiver" },
    { key: "message", label: "Message" },
    { key: "date", label: "Date" },
];