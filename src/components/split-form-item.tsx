import { XCircle } from "lucide-react";
import { Fragment } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SplitFormInputs } from "./split-form";
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

interface SplitItemProps {
  field: FieldArrayWithId<SplitFormInputs, "splits", "id">;
  index: number;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<SplitFormInputs>;
}

const SplitItem: React.FC<SplitItemProps> = ({
  field,
  index,
  remove,
  register,
}) => {
  return (
    <Fragment key={field.id}>
      <div className='col-span-8'>
        <Input
          type='text'
          placeholder='Ethereum address or ENS'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          data-1p-ignore
          {...register(`splits.${index}.address`, {
            validate: (value: string) =>
              value.length > 0 || "Please enter an address",
          })}
        />
      </div>
      <Input
        className='col-span-2'
        min={0}
        data-1p-ignore
        {...register(`splits.${index}.portion`)}
      />
      <span className='col-span-1 text-xs ml-1'>33%</span>
      <Button
        variant='ghost'
        onClick={() => remove(index)}
        className='justify-self-end col-span-1 self-center text-muted-foreground hover:text-destructive-foreground hover:bg-destructive'
        size='icon'
      >
        <XCircle className='w-4 h-4' />
      </Button>
    </Fragment>
  );
};

export default SplitItem;
