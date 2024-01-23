import { useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { set } from "react-hook-form";

interface ReleaseBountyOptionProps {
  initialValue: number;
  onValueChange: (value: number) => void;
  enabled: boolean;
}

export function ReleaseBountyOption(props: ReleaseBountyOptionProps) {
  const [value, setValue] = useState<string>(props.initialValue.toString());
  const [checked, setChecked] = useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value || "0");
    if (v >= 0 && v <= 100) {
      setValue(e.target.value);
    }
    if (!isNaN(v)) {
      props.onValueChange(v);
    }
  };

  return (
    <div className='flex items-center space-x-2'>
      <Switch
        id='release-bounty'
        onCheckedChange={setChecked}
        disabled={!props.enabled}
        aria-readonly={!props.enabled}
      />
      <Label htmlFor='release-bounty'>Release bounty?</Label>

      {checked && (
        <div className='flex items-center space-x-2 w-full'>
          <Label htmlFor='release-bounty'></Label>
          <input
            onChange={handleValueChange}
            value={value.toString()}
            id='release-bounty'
            type='number'
            max={100}
            min={0}
            placeholder='Enter bounty percent'
            disabled={!props.enabled}
            aria-readonly={!props.enabled}
            className='w-full text-left focus:outline-none focus:ring-0 bg-muted p-2 px-2 rounded-md text-sm text-foreground '
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            data-1p-ignore
          />
        </div>
      )}
    </div>
  );
}
