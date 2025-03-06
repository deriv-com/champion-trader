import { convertHourToMinutes, formatDurationDisplay } from "../duration";

describe("duration utils", () => {
    describe("convertHourToMinutes", () => {
        it("converts full hours to minutes", () => {
            expect(convertHourToMinutes("1:00")).toBe(60);
            expect(convertHourToMinutes("2:00")).toBe(120);
            expect(convertHourToMinutes("24:00")).toBe(1440);
        });

        it("converts hours with minutes to total minutes", () => {
            expect(convertHourToMinutes("1:30")).toBe(90);
            expect(convertHourToMinutes("2:15")).toBe(135);
            expect(convertHourToMinutes("3:45")).toBe(225);
        });

        it("handles single digit minutes", () => {
            expect(convertHourToMinutes("1:05")).toBe(65);
            expect(convertHourToMinutes("2:08")).toBe(128);
        });

        it("handles hours without minutes", () => {
            expect(convertHourToMinutes("1")).toBe(60);
            expect(convertHourToMinutes("2")).toBe(120);
        });
    });

    describe("formatDurationDisplay", () => {
        it("formats tick durations", () => {
            expect(formatDurationDisplay("1 tick")).toBe("1 tick");
            expect(formatDurationDisplay("5 tick")).toBe("5 ticks");
        });

        it("formats second durations", () => {
            expect(formatDurationDisplay("1 second")).toBe("1 second");
            expect(formatDurationDisplay("30 second")).toBe("30 seconds");
        });

        it("formats minute durations", () => {
            expect(formatDurationDisplay("1 minute")).toBe("1 minute");
            expect(formatDurationDisplay("45 minute")).toBe("45 minutes");
        });

        it("formats hour durations", () => {
            expect(formatDurationDisplay("1 hour")).toBe("1 hour");
            expect(formatDurationDisplay("2 hour")).toBe("2 hours");
            expect(formatDurationDisplay("1:30 hour")).toBe("1 hour 30 minutes");
            expect(formatDurationDisplay("2:15 hour")).toBe("2 hours 15 minutes");
            expect(formatDurationDisplay("1:01 hour")).toBe("1 hour 1 minute");
        });

        it("formats day durations", () => {
            expect(formatDurationDisplay("1 day")).toBe("1 day");
            expect(formatDurationDisplay("7 day")).toBe("7 day");
        });
    });
});
