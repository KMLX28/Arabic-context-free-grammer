import ArabicGrammar from "./ArabicGrammar";
import Parser from "../Parser";
import Sentence from "./Sentence";

export default class VerbalSentence extends ArabicGrammar {
    private sentence: Sentence;

    constructor(parser: Parser, sentence: Sentence) {
        super(parser);
        this.sentence = sentence;
        this.verbalSentence();
    }

    verbalSentence() {
        this.parser.currentSentenceType = 'V';
        if (this.IsLookaheadEquals('فعل لازم')) {
            this.match('فعل لازم');
            this.verbalSubjectPhrase();
            this.remainingIntransitive();
        } else if (this.IsLookaheadEquals('فعل متعدي')) {
            this.match('فعل متعدي');
            this.verbalSubjectPhrase();
            this.remainingTransitive();
        }
    }

    verbalSubjectPhrase() {
        this.sentence.subject();
        this.remainingVerbalSubjectPhrase();

    }

    remainingVerbalSubjectPhrase() {
        this.sentence.complementPhrase();
    }

    remainingIntransitive() {
        if (this.parser.isSemiSentence())
            this.sentence.adjunctsPhrase();
    }

    remainingTransitive() {
        if (this.parser.isObject()) {
            this.sentence.object();
            this.remainingTransitiveObject();
        }
    }

    remainingTransitiveObject() {
        if (this.parser.isSemiSentence())
            this.sentence.adjunctsPhrase();
    }
}
