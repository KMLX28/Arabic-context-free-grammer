import ArabicGrammar from "./ArabicGrammar";
import Parser from "../Parser";
import Sentence from "./Sentence";

export default class NominalSentence extends ArabicGrammar {
    private sentence: Sentence;

    constructor(parser: Parser, sentence: Sentence) {
        super(parser);
        this.sentence = sentence;
        this.nominalSentence();
    }

    nominalSentence() {
        this.parser.currentSentenceType = 'N';
        this.annular();
        this.subjectPhrase();
        this.predicatePhrase();
    }

    annular() {
        if (this.isLookaheadIn([
            'حرف نفي',
            'حرف استفهام',
        ]))
            this.sentence.originalParticle();
        else if (this.isLookaheadEquals('حرف جر'))
            this.sentence.semiSentence();
        else if (this.isLookaheadIn([
            'حرف ناسخ',
            'فعل ناسخ',
        ]))
            this.sentence.transformedParticle();
    }

    subjectPhrase() {
        if (this.isLookaheadEquals('اسم')) {
            this.sentence.subject();
        } else {
            this.sentence.subject();
            this.sentence.expansionPhrase();
        }
    }

    predicatePhrase() {
        this.predicate();
        this.sentence.expansionPhrase();
    }

    predicate() {
        if (this.isLookaheadIn(['اسم فاعل', 'اسم مفعول', 'صيغة مبالغة', 'صفة مشبهة']))
            this.sentence.derivedNoun();
        else if (this.isLookaheadEquals('اسم')) {
            this.match('اسم', 'خبر');
        } else if (this.parser.isSemiSentence()) {
            const prevIndex = this.parser.currentIndex;
            this.sentence.semiSentence();
            const currentIndex = this.parser.currentIndex;
            const predicateSentence = this.getWordsByIndex(prevIndex, currentIndex);
            this.parser.result += `الجملة السابقة خبر(${predicateSentence})`;
            console.log(`الجملة السابقة خبر(${predicateSentence})`);
        } else new Sentence(this.parser);
    }

}
