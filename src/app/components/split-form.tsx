"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Plus, XCircle } from "lucide-react";
import React, { Fragment, useCallback } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

interface SplitFormProps {}

type Inputs = {
  splits: {
    address: string;
    portion: number;
  }[];
};

const SplitForm: React.FC<SplitFormProps> = ({}) => {
  const {
    register,
    control,
    formState: { errors, touchedFields },
  } = useForm<Inputs>({
    mode: "onTouched",

    defaultValues: {
      splits: Array.from({ length: 2 }).map(() => ({
        address: "",
        portion: 100,
      })),
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "splits",
    }
  );

  const [parent] = useAutoAnimate(/* optional config */);

  const addRecipient = useCallback(() => {
    prepend({
      address: "",
      portion: 100,
    });
  }, [prepend]);

  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-row flex-wrap justify-between'>
        <h3 className='text-2xl mb-4'>Create a Splitter</h3>

        <Button variant='outline' onClick={addRecipient}>
          <Plus className='mr-2 h-4 w-4' />
          Add a recipient
        </Button>
      </div>

      <div className='space-y-2'>
        <div className='grid grid-cols-12 gap-x-3'>
          <span className='col-span-2 text-xs ml-1'>Portion</span>
          <span className='col-span-9 text-xs ml-1'>Address</span>
          <span className='col-span-1'></span>
        </div>
        <div className='grid grid-cols-12 gap-3' ref={parent}>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <Input
                min={0}
                data-1p-ignore
                className='col-span-2'
                {...register(`splits.${index}.portion`)}
              />
              <div className='col-span-9'>
                <Input
                  type='text'
                  placeholder="Recipient's address"
                  autoComplete='off'
                  autoCorrect='off'
                  autoCapitalize='off'
                  spellCheck='false'
                  data-1p-ignore
                  {...register(`splits.${index}.address`, {
                    validate: (value) =>
                      value.length > 0 || "Please enter an address",
                  })}
                />
              </div>
              <Button
                variant='ghost'
                onClick={() => remove(index)}
                className='col-span-1'
                size='icon'
              >
                <XCircle />
              </Button>
            </Fragment>
          ))}
        </div>
      </div>
      <Button className='w-full'>Create {fields.length}-way Splitter</Button>
    </div>
  );
};

export default SplitForm;
