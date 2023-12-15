"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { XCircle } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched",
    defaultValues: {
      splits: Array.from({ length: 1 }).map(() => ({
        address: "",
        portion: 0,
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
  console.log(errors.splits?.[0]?.address?.message);

  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const addRecipient = () => {
    prepend({
      address: "",
      portion: 0,
    });
  };

  return (
    <div className='w-full space-y-unit-sm'>
      <Button color='primary' onClick={addRecipient}>
        Add a recipient
      </Button>

      <div
        className='flex flex-col items-center justify-stretch gap-unit-sm'
        ref={parent}
      >
        {fields.map((field, index) => (
          <fieldset key={field.id} className='block w-full'>
            <div className='flex w-full  flex-nowrap gap-unit-sm items-start'>
              <Input
                // variant='underlined'
                placeholder='50'
                min={0}
                type='number'
                // labelPlacement='outside'
                // label='Portion'
                className='max-w-[100px] text-right'
                {...register(`splits.${index}.portion`)}
              />
              <Input
                // variant='underlined'
                type='text'
                placeholder="Recipient's address"
                // label='Address'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                data-1p-ignore
                {...register(`splits.${index}.address`, {
                  validate: (value) =>
                    value.length > 0 || "Please enter an address",
                })}
                isInvalid={Boolean(errors.splits?.[index]?.address?.message)}
              />
              <Button
                // color='danger'
                variant='light'
                onClick={() => remove(index)}
                className='flex-none self-center'
                isIconOnly
              >
                <XCircle />
              </Button>
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
};

export default SplitForm;
