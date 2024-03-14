import { Skeleton } from '../animation/Skeleton'
import { Bone } from '../animation/Bone';
import { Animation } from '../animation/Animation';
import { Keyframe } from '../animation/Keyframe';
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { StringParser } from './StringParser';

export class AnimationParser
{
    /**
     * Parses the contents of an ASF file and stores the data in a given Skeleton object
     * 
     * @param asf - The contents of the Acclaim skeleton file as a string
     * @param skeleton - The Skeleton object to store the data
     */
    public static parseASF(asf: string, skeleton: Skeleton)
    {
        const parser = new StringParser(asf);
        let usingDegrees = false;

        while(!parser.done())
        {
            const nextToken = parser.readToken();
            if (nextToken.charAt(0) == '#')
                parser.consumeLine();
            else if(nextToken == ':units')
                usingDegrees = this.parseUnits(parser);
            else if(nextToken == ':root')
                this.parseRoot(parser, skeleton, usingDegrees);
            else if(nextToken == ':bonedata')
                this.parseBoneData(parser, skeleton, usingDegrees);
            else if(nextToken == ':hierarchy')
                this.parseHierarchy(parser, skeleton);
            else if(nextToken == ':version')
                parser.consumeLine();
            else if(nextToken == ':name')
                parser.consumeLine();
            else if(nextToken == ':documentation')
            {
                while(!parser.done() && !(parser.peek().charAt(0) == ':'))
                    parser.consumeLine();
            }
            else
            {
                console.error("Error: encountered unknown token: " + nextToken)
                return;
            }
        }
    }

    private static parseUnits(parser: StringParser): boolean
    {
        let done: boolean;
        let usingDegrees = false;
        do
        {
            done = true;
            if(parser.expect('mass') || parser.expect('length'))
            {
                done = false;
                parser.consumeLine();
            }
            else if(parser.expect('angle'))
            {
                done = false;
                usingDegrees = parser.readToken() == 'deg';
            }
        } while(!done);

        return usingDegrees;
    }

    private static parseRoot(parser: StringParser, skeleton: Skeleton, usingDegrees: boolean): void
    {
        let done: boolean;
        do
        {
            done = true;
            if(parser.expect('order'))
            {
                done = false;
                if( !parser.expect('TX') || !parser.expect('TY') || !parser.expect('TZ') ||
                    !parser.expect('RX') || !parser.expect('RY') || !parser.expect('RZ'))
                {
                    console.error('Error: order not in the order expected');
                    return;
                }
            }
            else if(parser.expect('axis'))
            {
                done = false;
                if(!parser.expect('XYZ'))
                {
                    console.error('Error: axis not in the order expected');
                    return;
                }
            }
            else if(parser.expect('position'))
            {
                done = false;
                skeleton.rootPosition.set(parser.readNumber(), parser.readNumber(), parser.readNumber());

                // Convert from AMC mocap units to meters
                skeleton.rootPosition.multiplyScalar(0.056444);
            }
            else if(parser.expect('orientation'))
            {
                done = false;

                const angles = new Vector3(parser.readNumber(), parser.readNumber(), parser.readNumber());
                if(usingDegrees)
                    angles.multiplyScalar(Math.PI / 180);

                // AMC mocap data uses ZYX transformation order for Euler angles
                skeleton.rootRotation = Quaternion.makeEulerAngles(angles.x, angles.y, angles.z, 'ZYX');
            }
        } while(!done);
    }

    private static parseBoneData(parser: StringParser, skeleton: Skeleton, usingDegrees: boolean): void
    {
        while(parser.expect('begin'))
        {
            const bone = new Bone();
            while(!parser.expect('end'))
            {
                if(parser.expect('id'))
                {
                    // not using, discard
                    parser.consumeLine();
                }
                else if(parser.expect('name'))
                {
                    const name = parser.readToken();
                    bone.name = name;
                    skeleton.bones.set(name, bone);
                }
                else if(parser.expect('direction'))
                {
                    bone.direction.x = parser.readNumber();
                    bone.direction.y = parser.readNumber();
                    bone.direction.z = parser.readNumber();
                }
                else if(parser.expect('length'))
                {
                    // Convert from AMC mocap units to meters
                    bone.length = parser.readNumber() * 0.056444;
                }
                else if(parser.expect('axis'))
                {
                    const angles = new Vector3(parser.readNumber(), parser.readNumber(), parser.readNumber());
                    if(usingDegrees)
                        angles.multiplyScalar(Math.PI / 180);

                    if(parser.expect('XYZ'))
                    {
                        // AMC mocap data uses ZYX transformation order for Euler angles
                        const rotationToBoneSpace = Quaternion.makeEulerAngles(angles.x, angles.y, angles.z, 'ZYX');
                        const boneToRotationSpace = rotationToBoneSpace.inverse();
                        
                        skeleton.boneToRotationSpaceMap.set(bone.name, boneToRotationSpace);
                        skeleton.rotationToBoneSpaceMap.set(bone.name, rotationToBoneSpace);
                    }
                    else
                    {
                        console.error('Error: bone axis not in the order expected');
                        return;
                    }
                }
                else if(parser.expect('dof'))
                {
                    bone.dofs[0] = parser.expect('rx');
                    bone.dofs[1] = parser.expect('ry');
                    bone.dofs[2] = parser.expect('rz');
                }
                else if(parser.expect('limits'))
                {
                    if(bone.dofs[0])
                    {
                        // not using, discard
                        parser.consumeLine();  
                    }

                    if(bone.dofs[1])
                    {
                        // not using, discard
                        parser.consumeLine();  
                    }

                    if(bone.dofs[2])
                    {
                        // not using, discard
                        parser.consumeLine();  
                    }
                }
            }

            bone.position.copy(bone.direction);
            bone.position.multiplyScalar(bone.length);
        }
    }

    private static parseHierarchy(parser: StringParser, skeleton: Skeleton): void
    {
        if(parser.expect('begin'))
        {
            while(!parser.expect('end'))
            {
                const parent = parser.readToken();
                const children = parser.readLine();

                children.forEach((child: string) => {
                    if(parent == 'root')
                    {
                        const bone = skeleton.bones.get(child)!;
                        skeleton.add(bone);
                    }
                    else
                    {
                        const bone = skeleton.bones.get(child)!;
                        const parentBone = skeleton.bones.get(parent)!;
                        parentBone.add(bone);
                    }
                });
            }
        }
        else
        {
            console.error('Error: reading hierarchy, expected begin, found ' + parser.peek());
        }
    }

    /**
     * Parses the contents of an AMC file and stores the data in a given Animation object
     * 
     * @param amc - The contents of the Acclaim mocap file as a string
     * @param animation - The Animation object to store the data
     */
    public static parseAMC(amc: string, skeleton: Skeleton, animation: Animation)
    {
        const parser = new StringParser(amc);

        while(!parser.done())
        {
            // Consume the header
            while(parser.peek().charAt(0) == '#' || parser.peek().charAt(0) == ':')
            {
                parser.consumeLine();
            }

            while(!parser.done())
            {
                const keyframe = new Keyframe();
                keyframe.frame = parser.readNumber();
    
                // Loop until we encounter the next frame number
                while(!parser.done() && isNaN(Number(parser.peek())))
                {
                    const boneName = parser.readToken();
                    if(boneName == 'root')
                    {
                        // Convert from AMC mocap units to meters
                        keyframe.rootPosition.x = parser.readNumber() * 0.056444;
                        keyframe.rootPosition.y = parser.readNumber() * 0.056444;
                        keyframe.rootPosition.z = parser.readNumber() * 0.056444;
                    
                        // Convert from degrees to radians
                        const rootRotation = new Vector3();
                        rootRotation.x = parser.readNumber() * Math.PI / 180;
                        rootRotation.y = parser.readNumber() * Math.PI / 180;
                        rootRotation.z = parser.readNumber() * Math.PI / 180;

                        // AMC mocap data uses ZYX transformation order for Euler angles
                        keyframe.rootRotation = Quaternion.makeEulerAngles(rootRotation.x, rootRotation.y, rootRotation.z, 'ZYX');
                    }
                    else
                    {
                        const bone = skeleton.bones.get(boneName);

                        if(bone)
                        {
                            const angles = new Vector3();
                            if(bone.dofs[0])
                                angles.x = parser.readNumber() * Math.PI / 180;
                            if(bone.dofs[1])
                                angles.y = parser.readNumber() * Math.PI / 180;
                            if(bone.dofs[2])
                                angles.z = parser.readNumber() * Math.PI / 180;
    
                            // AMC mocap data uses ZYX transformation order for Euler angles
                            const jointRotation = skeleton.boneToRotationSpaceMap.get(bone.name)!.clone();
                            jointRotation.premultiply(Quaternion.makeEulerAngles(angles.x, angles.y, angles.z, 'ZYX'));
                            jointRotation.premultiply(skeleton.rotationToBoneSpaceMap.get(bone.name)!);
                            keyframe.setJointRotation(bone.name, jointRotation);
                        }
                    }
                }

                animation.frames.push(keyframe);
            }
        }
    }
}