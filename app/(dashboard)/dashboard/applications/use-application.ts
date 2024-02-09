import { atom, useAtom } from "jotai";
import { Application } from "@/lib/api/application";

type Config = {
  selected: Application["job_id"] | null;
};

// Define the initial config atom
const configAtom = atom<Config>({
  selected: null, // Initialize with null or any default value
});

// Create a hook to access and update the config atom
export function useApplication(applications: Application[]) {
  // Destructure the state and setter function from the configAtom tuple
  const [config, setConfig] = useAtom(configAtom);

  // Initialize the configAtom with the first application's job_id once the applications are passed
  if (applications.length > 0 && config.selected === null) {
    setConfig({ selected: applications[0].job_id });
  }

  // Return both the config state and the function to update the selected job ID
  return [config, setConfig] as const;
}